-- =============================================================================
-- EMC WhatsApp Inbox — Phase 1 schema
-- Target: the dedicated EMC Supabase project (ap-south-1) ONLY.
--
-- Contents
--   1. Extensions + private helper schema
--   2. Tables (staff, contacts, conversations, messages, labels, quick
--      replies, internal notes, audit log)
--   3. Indexes
--   4. Helper / trigger functions (updated_at, RLS role checks, guards,
--      conversation roll-up, audit)
--   5. Webhook functions: wa_ingest_inbound, wa_apply_status
--   6. Grants (least privilege) + Row Level Security policies
--   7. Seed data (system labels, team quick replies)
--
-- Access model
--   * anon: no access to anything in this file.
--   * authenticated: only users with an ACTIVE row in staff_profiles see
--     anything. Everything else is enforced by RLS + column-level grants +
--     guard triggers. Being signed in with Google is NOT enough on its own.
--   * service_role (server only — webhook + send routes): bypasses RLS; the
--     only role allowed to insert/modify WhatsApp messages and call the
--     webhook functions.
--   * audit_log is written only by SECURITY DEFINER triggers, so it cannot
--     be skipped or forged from the API, and it is append-only.
--
-- Phone numbers are stored as WhatsApp IDs: country code + number, digits
-- only, no "+" (e.g. 919840922491) — the same format Meta sends as `from`
-- and the existing send-template route sends as `to`.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Extensions + private schema
-- -----------------------------------------------------------------------------

-- Trigram indexes make ILIKE '%term%' searches (name, phone fragment,
-- hospital, message text) use an index instead of a full scan.
create extension if not exists pg_trgm with schema extensions;

-- Helper functions live outside `public` so PostgREST never exposes them as
-- RPC endpoints. `authenticated` needs USAGE because RLS policies call them.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;


-- -----------------------------------------------------------------------------
-- 2. Tables
-- -----------------------------------------------------------------------------

-- One row per EMC staff member allowed into the Inbox. Created by an admin
-- after the person has signed in once (so their auth.users row exists).
-- Staff are deactivated (is_active = false), never deleted: messages and
-- notes they wrote reference them with ON DELETE RESTRICT.
create table public.staff_profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text not null check (char_length(btrim(full_name)) between 1 and 120),
  email       text not null check (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  role        text not null default 'staff'
              check (role in ('admin', 'telecaller', 'pro', 'bdm', 'staff')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.contacts (
  id                     uuid primary key default gen_random_uuid(),
  phone                  text not null unique check (phone ~ '^[1-9][0-9]{7,14}$'),
  whatsapp_profile_name  text check (char_length(whatsapp_profile_name) <= 200),
  name                   text check (char_length(name) <= 200),
  email                  text check (email is null or (char_length(email) <= 254 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  organization           text check (char_length(organization) <= 200),
  city                   text check (char_length(city) <= 120),
  requirement            text check (char_length(requirement) <= 500),
  notes                  text check (char_length(notes) <= 5000),
  -- Marketing consent is never assumed: default false, and turning it on
  -- requires recording when and where the consent came from.
  marketing_opt_in       boolean not null default false,
  opt_in_at              timestamptz,
  opt_in_source          text check (char_length(opt_in_source) <= 200),
  opted_out              boolean not null default false,
  opted_out_at           timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  constraint contacts_opt_in_recorded  check (not marketing_opt_in or (opt_in_at is not null and opt_in_source is not null)),
  constraint contacts_opt_out_recorded check (not opted_out or opted_out_at is not null),
  constraint contacts_opt_in_not_opted_out check (not (marketing_opt_in and opted_out))
);

-- Exactly one ongoing thread per contact (like WhatsApp itself); status
-- cycles new → open → … → closed and back to open on a new customer message.
create table public.wa_conversations (
  id                    uuid primary key default gen_random_uuid(),
  contact_id            uuid not null unique references public.contacts (id) on delete restrict,
  status                text not null default 'new'
                        check (status in ('new', 'open', 'follow_up', 'waiting', 'appointment', 'closed')),
  -- Current assignment only; assignment history lives in audit_log.
  assigned_staff_id     uuid references public.staff_profiles (id) on delete set null,
  unread_count          integer not null default 0 check (unread_count >= 0),
  last_message_preview  text check (char_length(last_message_preview) <= 200),
  last_message_at       timestamptz,
  -- Customer's latest message time (Meta timestamp). The app uses this to
  -- enforce Meta's 24-hour customer service window for free-form replies.
  last_inbound_at       timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  -- Target of wa_messages' composite FK, so a message's contact_id can never
  -- disagree with its conversation's contact_id.
  constraint wa_conversations_id_contact_key unique (id, contact_id)
);

create table public.wa_messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null,
  contact_id       uuid not null,
  direction        text not null check (direction in ('inbound', 'outbound')),
  -- Meta's inbound types also include contacts, button (template quick-reply
  -- taps) and unsupported; anything else is stored as 'unsupported' by
  -- wa_ingest_inbound rather than dropping the customer's message.
  message_type     text not null
                   check (message_type in ('text', 'template', 'image', 'video', 'audio', 'document', 'sticker',
                                           'location', 'interactive', 'reaction', 'contacts', 'button', 'unsupported')),
  body             text check (char_length(body) <= 65536),
  -- (Postgres regex repetition bounds max out at 255, so length is checked separately.)
  template_name    text check (char_length(template_name) <= 512 and template_name ~ '^[a-z0-9_]+$'),
  media_id         text check (char_length(media_id) <= 256),
  -- Meta's wamid. NULL only for an outbound message that is still 'queued'
  -- (row written before the Graph API call returned an id).
  meta_message_id  text unique check (char_length(meta_message_id) between 1 and 256),
  status           text not null
                   check (status in ('received', 'queued', 'sent', 'delivered', 'read', 'failed')),
  error_code       integer,
  error_title      text check (char_length(error_title) <= 500),
  created_by       uuid references public.staff_profiles (id) on delete restrict,
  created_at       timestamptz not null default now(),
  -- Inbound: the customer's send time (Meta timestamp). Outbound: Meta 'sent'.
  sent_at          timestamptz,
  delivered_at     timestamptz,
  read_at          timestamptz,
  failed_at        timestamptz,
  constraint wa_messages_conversation_fk foreign key (conversation_id, contact_id)
    references public.wa_conversations (id, contact_id) on delete restrict,
  constraint wa_messages_direction_status check (
    (direction = 'inbound'  and status = 'received') or
    (direction = 'outbound' and status in ('queued', 'sent', 'delivered', 'read', 'failed'))
  ),
  constraint wa_messages_inbound_has_meta_id check (direction = 'outbound' or meta_message_id is not null),
  constraint wa_messages_inbound_not_staff  check (direction = 'outbound' or created_by is null),
  constraint wa_messages_template_named     check (message_type <> 'template' or template_name is not null)
);

create table public.wa_labels (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(btrim(name)) between 1 and 40),
  color       text not null default '#586C7C' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  emoji       text check (char_length(emoji) <= 16),
  -- System labels cannot be deleted by anyone (guard trigger below).
  is_system   boolean not null default false,
  created_at  timestamptz not null default now()
);

create table public.wa_conversation_labels (
  conversation_id  uuid not null references public.wa_conversations (id) on delete cascade,
  label_id         uuid not null references public.wa_labels (id) on delete cascade,
  added_by         uuid references public.staff_profiles (id) on delete set null,
  added_at         timestamptz not null default now(),
  primary key (conversation_id, label_id)
);

-- Shortcut is stored without the leading "/" (typed as /nabh → 'nabh').
create table public.wa_quick_replies (
  id          uuid primary key default gen_random_uuid(),
  shortcut    text not null check (shortcut ~ '^[a-z0-9][a-z0-9_-]{0,31}$'),
  title       text not null check (char_length(btrim(title)) between 1 and 80),
  body        text not null check (char_length(btrim(body)) between 1 and 4096),
  category    text check (char_length(category) <= 60),
  scope       text not null default 'team' check (scope in ('team', 'personal')),
  owner_id    uuid references public.staff_profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint wa_quick_replies_scope_owner check (
    (scope = 'team' and owner_id is null) or (scope = 'personal' and owner_id is not null)
  )
);

-- Internal notes live in their own table — there is no column or code path
-- that can turn a note into a WhatsApp message.
create table public.wa_internal_notes (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references public.wa_conversations (id) on delete cascade,
  author_id        uuid not null references public.staff_profiles (id) on delete restrict,
  body             text not null check (char_length(btrim(body)) between 1 and 5000),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Append-only. actor_id deliberately has NO foreign key: history must
-- survive even if a staff/auth user is ever removed. NULL = system/webhook.
create table public.audit_log (
  id           uuid primary key default gen_random_uuid(),
  actor_id     uuid,
  action       text not null check (char_length(action) between 1 and 100),
  entity_type  text not null check (char_length(entity_type) between 1 and 100),
  entity_id    uuid,
  details      jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);


-- -----------------------------------------------------------------------------
-- 3. Indexes
-- -----------------------------------------------------------------------------
-- Already indexed by constraints: contacts.phone (unique),
-- wa_messages.meta_message_id (unique), wa_conversations.contact_id (unique),
-- wa_conversation_labels (conversation_id, label_id) (PK).

create unique index staff_profiles_email_key on public.staff_profiles (lower(email));

-- Inbox search (ILIKE '%…%'): name, WhatsApp profile name, phone fragment,
-- hospital/clinic, requirement.
create index contacts_name_trgm_idx         on public.contacts using gin (name extensions.gin_trgm_ops);
create index contacts_profile_name_trgm_idx on public.contacts using gin (whatsapp_profile_name extensions.gin_trgm_ops);
create index contacts_phone_trgm_idx        on public.contacts using gin (phone extensions.gin_trgm_ops);
create index contacts_organization_trgm_idx on public.contacts using gin (organization extensions.gin_trgm_ops);
create index contacts_requirement_trgm_idx  on public.contacts using gin (requirement extensions.gin_trgm_ops);

-- Conversation list: filter by status / assignee, newest first.
create index wa_conversations_last_message_idx   on public.wa_conversations (last_message_at desc nulls last);
create index wa_conversations_status_last_idx    on public.wa_conversations (status, last_message_at desc nulls last);
create index wa_conversations_assigned_last_idx  on public.wa_conversations (assigned_staff_id, last_message_at desc nulls last);
create index wa_conversations_unread_idx         on public.wa_conversations (last_message_at desc) where unread_count > 0;

-- Chat history (also serves the composite FK lookup on conversation delete).
create index wa_messages_conversation_created_idx on public.wa_messages (conversation_id, created_at desc);
create index wa_messages_status_created_idx       on public.wa_messages (status, created_at desc);
create index wa_messages_created_by_idx           on public.wa_messages (created_by) where created_by is not null;
create index wa_messages_body_trgm_idx            on public.wa_messages using gin (body extensions.gin_trgm_ops);

create unique index wa_labels_name_key on public.wa_labels (lower(name));
create index wa_conversation_labels_label_idx on public.wa_conversation_labels (label_id);

-- One team shortcut per name; each person's personal shortcuts unique to them.
create unique index wa_quick_replies_team_shortcut_key     on public.wa_quick_replies (shortcut) where scope = 'team';
create unique index wa_quick_replies_personal_shortcut_key on public.wa_quick_replies (owner_id, shortcut) where scope = 'personal';

create index wa_internal_notes_conversation_idx on public.wa_internal_notes (conversation_id, created_at);
create index wa_internal_notes_author_idx       on public.wa_internal_notes (author_id);

create index audit_log_created_idx on public.audit_log (created_at desc);
create index audit_log_entity_idx  on public.audit_log (entity_type, entity_id, created_at desc);
create index audit_log_actor_idx   on public.audit_log (actor_id, created_at desc);


-- -----------------------------------------------------------------------------
-- 4. Helper and trigger functions
-- -----------------------------------------------------------------------------

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Role of the signed-in user, or NULL if they are not ACTIVE staff.
-- SECURITY DEFINER so policies on staff_profiles don't recurse into RLS.
create function private.current_staff_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select sp.role
  from public.staff_profiles sp
  where sp.id = auth.uid() and sp.is_active;
$$;

create function private.is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.current_staff_role() is not null;
$$;

create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(private.current_staff_role() = 'admin', false);
$$;

-- Short list-view text for a message ("📷 Photo", first 160 chars of text…).
create function private.message_preview(p_type text, p_body text)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_body text := nullif(btrim(regexp_replace(coalesce(p_body, ''), '\s+', ' ', 'g')), '');
begin
  return left(
    case p_type
      when 'image'       then '📷 ' || coalesce(v_body, 'Photo')
      when 'video'       then '🎥 ' || coalesce(v_body, 'Video')
      when 'audio'       then '🎤 Audio'
      when 'document'    then '📄 ' || coalesce(v_body, 'Document')
      when 'sticker'     then 'Sticker'
      when 'location'    then '📍 Location'
      when 'contacts'    then '👤 Contact card'
      when 'reaction'    then 'Reacted ' || coalesce(v_body, '')
      when 'template'    then coalesce(v_body, 'Template message')
      when 'unsupported' then 'Unsupported message'
      else coalesce(v_body, 'Message')
    end,
    160
  );
end;
$$;

-- Writes one audit row. Only ever called from the triggers below.
create function private.write_audit(
  p_actor_id uuid,
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_details jsonb default '{}'::jsonb
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.audit_log (actor_id, action, entity_type, entity_id, details)
  values (p_actor_id, p_action, p_entity_type, p_entity_id, coalesce(p_details, '{}'::jsonb));
$$;

-- Keeps the conversation row in sync with every newly inserted message
-- (inbound via wa_ingest_inbound, outbound via the server send route).
-- Uses GREATEST so a late/retried older message never rewinds the thread.
create function private.on_wa_message_inserted()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_at timestamptz := case when new.direction = 'inbound' then coalesce(new.sent_at, new.created_at) else new.created_at end;
begin
  update public.wa_conversations c
  set last_message_preview = case
        when c.last_message_at is null or v_at >= c.last_message_at
          then private.message_preview(new.message_type, new.body)
        else c.last_message_preview
      end,
      last_message_at = greatest(c.last_message_at, v_at),
      last_inbound_at = case when new.direction = 'inbound' then greatest(c.last_inbound_at, v_at) else c.last_inbound_at end,
      unread_count    = c.unread_count + case when new.direction = 'inbound' then 1 else 0 end,
      -- A customer writing again re-opens a closed / waiting-for-customer thread.
      status          = case when new.direction = 'inbound' and c.status in ('closed', 'waiting') then 'open' else c.status end
  where c.id = new.conversation_id;

  if new.direction = 'outbound' then
    perform private.write_audit(
      new.created_by, 'message.send', 'wa_conversation', new.conversation_id,
      jsonb_build_object('message_id', new.id, 'message_type', new.message_type, 'template_name', new.template_name)
    );
  end if;

  return null;
end;
$$;

-- Enforces assignment rules for signed-in staff (RLS can't compare OLD/NEW):
--   * admin / bdm: may assign or reassign to any active staff member.
--   * telecaller / pro / staff: may only "assign to me" on an unassigned
--     conversation, or un-assign themselves.
--   * staff may only reset unread_count to 0 (mark read in the Inbox).
-- Server/webhook writes (no auth.uid()) skip the role checks.
create function private.guard_wa_conversation_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_role text;
begin
  if new.assigned_staff_id is not null
     and new.assigned_staff_id is distinct from old.assigned_staff_id
     and not exists (select 1 from public.staff_profiles sp where sp.id = new.assigned_staff_id and sp.is_active) then
    raise exception 'Conversations can only be assigned to active staff.' using errcode = 'check_violation';
  end if;

  if v_uid is null then
    return new;
  end if;

  v_role := private.current_staff_role();
  if v_role is null then
    raise exception 'Not an active staff member.' using errcode = 'insufficient_privilege';
  end if;

  if new.assigned_staff_id is distinct from old.assigned_staff_id and v_role not in ('admin', 'bdm') then
    if not (
      (old.assigned_staff_id is null and new.assigned_staff_id = v_uid) or
      (old.assigned_staff_id = v_uid and new.assigned_staff_id is null)
    ) then
      raise exception 'Only admins and BDMs can assign conversations to other staff.' using errcode = 'insufficient_privilege';
    end if;
  end if;

  if new.unread_count <> old.unread_count and new.unread_count <> 0 then
    raise exception 'Staff can only mark a conversation as read.' using errcode = 'insufficient_privilege';
  end if;

  return new;
end;
$$;

create function private.audit_wa_conversation_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    perform private.write_audit(auth.uid(), 'conversation.status_changed', 'wa_conversation', new.id,
      jsonb_build_object('from', old.status, 'to', new.status));
  end if;
  if new.assigned_staff_id is distinct from old.assigned_staff_id then
    perform private.write_audit(auth.uid(), 'conversation.assigned', 'wa_conversation', new.id,
      jsonb_build_object('from', old.assigned_staff_id, 'to', new.assigned_staff_id));
  end if;
  return null;
end;
$$;

create function private.audit_wa_conversation_label()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.wa_conversation_labels := case when tg_op = 'DELETE' then old else new end;
begin
  perform private.write_audit(
    coalesce(auth.uid(), v_row.added_by),
    case when tg_op = 'DELETE' then 'conversation.label_removed' else 'conversation.label_added' end,
    'wa_conversation', v_row.conversation_id,
    jsonb_build_object('label_id', v_row.label_id,
                       'label_name', (select l.name from public.wa_labels l where l.id = v_row.label_id))
  );
  return null;
end;
$$;

-- Consent changes only (opt-in / opt-out), including a contact created with
-- consent already recorded. actor NULL = customer via webhook.
create function private.audit_contact_consent()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if not (new.marketing_opt_in or new.opted_out) then
      return null;
    end if;
  elsif not (new.marketing_opt_in is distinct from old.marketing_opt_in
             or new.opted_out is distinct from old.opted_out
             or new.opt_in_source is distinct from old.opt_in_source) then
    return null;
  end if;

  perform private.write_audit(auth.uid(), 'contact.consent_changed', 'contact', new.id,
    jsonb_build_object(
      'marketing_opt_in', jsonb_build_object('from', case when tg_op = 'UPDATE' then old.marketing_opt_in end, 'to', new.marketing_opt_in),
      'opted_out',        jsonb_build_object('from', case when tg_op = 'UPDATE' then old.opted_out end,        'to', new.opted_out),
      'opt_in_source',    new.opt_in_source
    ));
  return null;
end;
$$;

-- Note text is NOT copied into the audit log — only who/when/which note.
create function private.audit_wa_internal_note()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.wa_internal_notes := case when tg_op = 'DELETE' then old else new end;
begin
  perform private.write_audit(
    coalesce(auth.uid(), v_row.author_id),
    case tg_op when 'INSERT' then 'note.added' when 'UPDATE' then 'note.edited' else 'note.deleted' end,
    'wa_conversation', v_row.conversation_id,
    jsonb_build_object('note_id', v_row.id)
  );
  return null;
end;
$$;

create function private.audit_staff_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    perform private.write_audit(auth.uid(), 'staff.created', 'staff_profile', new.id,
      jsonb_build_object('role', new.role, 'is_active', new.is_active));
  elsif new.role is distinct from old.role or new.is_active is distinct from old.is_active then
    perform private.write_audit(auth.uid(), 'staff.access_changed', 'staff_profile', new.id,
      jsonb_build_object('role', jsonb_build_object('from', old.role, 'to', new.role),
                         'is_active', jsonb_build_object('from', old.is_active, 'to', new.is_active)));
  end if;
  return null;
end;
$$;

-- Never leave the Inbox without an active admin.
create function private.guard_last_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'admin' and old.is_active and not (new.role = 'admin' and new.is_active)
     and not exists (
       select 1 from public.staff_profiles sp
       where sp.role = 'admin' and sp.is_active and sp.id <> old.id
     ) then
    raise exception 'Cannot remove the last active admin.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create function private.guard_system_label_delete()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.is_system then
    raise exception 'System labels cannot be deleted.' using errcode = 'check_violation';
  end if;
  return old;
end;
$$;

create function private.guard_audit_log_immutable()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'audit_log is append-only.' using errcode = 'insufficient_privilege';
end;
$$;

-- updated_at
create trigger set_updated_at before update on public.staff_profiles    for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.contacts          for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.wa_conversations  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.wa_quick_replies  for each row execute function private.set_updated_at();
create trigger set_updated_at before update on public.wa_internal_notes for each row execute function private.set_updated_at();

-- guards
create trigger guard_update      before update on public.wa_conversations for each row execute function private.guard_wa_conversation_update();
create trigger guard_last_admin  before update on public.staff_profiles   for each row execute function private.guard_last_admin();
create trigger guard_system_label before delete on public.wa_labels       for each row execute function private.guard_system_label_delete();
create trigger guard_immutable   before update or delete on public.audit_log for each row execute function private.guard_audit_log_immutable();
create trigger guard_no_truncate before truncate on public.audit_log for each statement execute function private.guard_audit_log_immutable();

-- conversation roll-up + audit
create trigger on_inserted  after insert on public.wa_messages            for each row execute function private.on_wa_message_inserted();
create trigger audit_update after update on public.wa_conversations       for each row execute function private.audit_wa_conversation_update();
create trigger audit_change after insert or delete on public.wa_conversation_labels for each row execute function private.audit_wa_conversation_label();
create trigger audit_consent after insert or update on public.contacts    for each row execute function private.audit_contact_consent();
create trigger audit_change after insert or update or delete on public.wa_internal_notes for each row execute function private.audit_wa_internal_note();
create trigger audit_change after insert or update on public.staff_profiles for each row execute function private.audit_staff_profile();


-- -----------------------------------------------------------------------------
-- 5. Webhook functions (service_role only)
-- -----------------------------------------------------------------------------

-- Saves one inbound WhatsApp message atomically and idempotently.
--   * find/create contact (by WhatsApp ID) and conversation
--   * insert the message; a Meta retry of the same wamid is a no-op
--     (the conversation counters are bumped by the AFTER INSERT trigger,
--     so they only move when a row is actually inserted)
--   * exact-match opt-out keywords turn marketing off (never deletes data)
-- `p_body` is the text body, media caption, button text or reaction emoji.
-- Returns {contact_id, conversation_id, message_id, duplicate, opted_out}.
create function public.wa_ingest_inbound(
  p_phone            text,
  p_meta_message_id  text,
  p_message_type     text,
  p_body             text default null,
  p_media_id         text default null,
  p_profile_name     text default null,
  p_sent_at          timestamptz default null
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_phone            text := regexp_replace(btrim(coalesce(p_phone, '')), '^\+', '');
  v_type             text := lower(btrim(coalesce(p_message_type, '')));
  v_profile          text := nullif(left(btrim(coalesce(p_profile_name, '')), 200), '');
  v_at               timestamptz := coalesce(p_sent_at, now());
  v_contact_id       uuid;
  v_conversation_id  uuid;
  v_message_id       uuid;
  v_duplicate        boolean := false;
  v_opted_out_now    boolean := false;
  v_keyword          text;
begin
  if v_phone !~ '^[1-9][0-9]{7,14}$' then
    raise exception 'wa_ingest_inbound: invalid sender phone' using errcode = 'invalid_parameter_value';
  end if;
  if p_meta_message_id is null or char_length(p_meta_message_id) not between 1 and 256 then
    raise exception 'wa_ingest_inbound: invalid meta_message_id' using errcode = 'invalid_parameter_value';
  end if;
  -- Unknown/new Meta types (and 'template', which is outbound-only) are kept
  -- as 'unsupported' so the customer's message is never lost.
  if v_type not in ('text', 'image', 'video', 'audio', 'document', 'sticker', 'location',
                    'interactive', 'reaction', 'contacts', 'button') then
    v_type := 'unsupported';
  end if;

  insert into public.contacts (phone, whatsapp_profile_name)
  values (v_phone, v_profile)
  on conflict (phone) do nothing
  returning id into v_contact_id;

  if v_contact_id is null then
    select c.id into v_contact_id from public.contacts c where c.phone = v_phone;
    if v_profile is not null then
      update public.contacts c
      set whatsapp_profile_name = v_profile
      where c.id = v_contact_id and c.whatsapp_profile_name is distinct from v_profile;
    end if;
  end if;

  insert into public.wa_conversations (contact_id)
  values (v_contact_id)
  on conflict (contact_id) do nothing
  returning id into v_conversation_id;

  if v_conversation_id is null then
    select c.id into v_conversation_id from public.wa_conversations c where c.contact_id = v_contact_id;
  end if;

  insert into public.wa_messages
    (conversation_id, contact_id, direction, message_type, body, media_id, meta_message_id, status, sent_at)
  values
    (v_conversation_id, v_contact_id, 'inbound', v_type, left(p_body, 65536),
     nullif(btrim(coalesce(p_media_id, '')), ''), p_meta_message_id, 'received', v_at)
  on conflict (meta_message_id) do nothing
  returning id into v_message_id;

  if v_message_id is null then
    v_duplicate := true;
    select m.id into v_message_id from public.wa_messages m where m.meta_message_id = p_meta_message_id;
  end if;

  -- Opt-out: the WHOLE message must be a clear opt-out phrase (case and
  -- punctuation ignored), e.g. "Stop", "STOP!", "Remove me." — a sentence
  -- that merely contains "stop" does not count. 'STOP PROMOTIONS' is the
  -- text of Meta's marketing-template opt-out button.
  if not v_duplicate and v_type in ('text', 'button') then
    v_keyword := btrim(regexp_replace(upper(regexp_replace(coalesce(p_body, ''), '[^A-Za-z]+', ' ', 'g')), '\s+', ' ', 'g'));
    if v_keyword in ('STOP', 'STOP ALL', 'UNSUBSCRIBE', 'DO NOT MESSAGE', 'REMOVE ME', 'OPT OUT', 'OPTOUT', 'STOP PROMOTIONS') then
      update public.contacts c
      set opted_out = true, opted_out_at = v_at, marketing_opt_in = false
      where c.id = v_contact_id and not c.opted_out;
      v_opted_out_now := found;
    end if;
  end if;

  return jsonb_build_object(
    'contact_id', v_contact_id,
    'conversation_id', v_conversation_id,
    'message_id', v_message_id,
    'duplicate', v_duplicate,
    'opted_out', v_opted_out_now
  );
end;
$$;

-- Applies one Meta status event to an outbound message, found by wamid.
-- Status only ever moves forward: queued → sent → delivered → read.
--   * An older event arriving late (e.g. 'delivered' after 'read') only
--     fills in its own timestamp if missing; the status is unchanged.
--   * 'failed' applies while the message is queued/sent; it is terminal.
--     A 'failed' after delivered/read is ignored (returned as 'stale').
-- Returns: applied | duplicate | stale | not_found | ignored.
-- 'not_found' is normal for messages sent outside the Inbox (e.g. the
-- internal send-template test route).
create function public.wa_apply_status(
  p_meta_message_id  text,
  p_status           text,
  p_status_at        timestamptz default null,
  p_error_code       integer default null,
  p_error_title      text default null
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_status    text := lower(btrim(coalesce(p_status, '')));
  v_at        timestamptz := coalesce(p_status_at, now());
  v_msg       record;
  v_new_rank  integer;
  v_cur_rank  integer;
begin
  if v_status not in ('sent', 'delivered', 'read', 'failed') or p_meta_message_id is null then
    return 'ignored';
  end if;

  select m.id, m.direction, m.status into v_msg
  from public.wa_messages m
  where m.meta_message_id = p_meta_message_id
  for update;

  if not found then
    return 'not_found';
  end if;
  if v_msg.direction <> 'outbound' then
    return 'ignored';
  end if;

  if v_status = 'failed' then
    if v_msg.status = 'failed' then
      return 'duplicate';
    elsif v_msg.status in ('delivered', 'read') then
      return 'stale';
    end if;
    update public.wa_messages m
    set status = 'failed',
        error_code = p_error_code,
        error_title = left(p_error_title, 500),
        failed_at = coalesce(m.failed_at, v_at)
    where m.id = v_msg.id;
    return 'applied';
  end if;

  v_new_rank := case v_status when 'sent' then 1 when 'delivered' then 2 else 3 end;
  -- 'failed' ranks above everything: a late sent/delivered/read never
  -- un-fails a message (its timestamp is still recorded).
  v_cur_rank := case v_msg.status when 'queued' then 0 when 'sent' then 1 when 'delivered' then 2
                                  when 'read' then 3 else 99 end;

  update public.wa_messages m
  set status       = case when v_new_rank > v_cur_rank then v_status else m.status end,
      sent_at      = case when v_status = 'sent'      then coalesce(m.sent_at, v_at)      else m.sent_at end,
      delivered_at = case when v_status = 'delivered' then coalesce(m.delivered_at, v_at) else m.delivered_at end,
      read_at      = case when v_status = 'read'      then coalesce(m.read_at, v_at)      else m.read_at end
  where m.id = v_msg.id;

  return case
    when v_new_rank > v_cur_rank then 'applied'
    when v_new_rank = v_cur_rank then 'duplicate'
    else 'stale'
  end;
end;
$$;


-- -----------------------------------------------------------------------------
-- 6. Grants + Row Level Security
-- -----------------------------------------------------------------------------
-- Supabase's default privileges grant ALL on new public tables/functions to
-- anon and authenticated. Reset that here, then grant only what each role
-- needs (column-level where possible). RLS still applies on top.

revoke all on table
  public.staff_profiles, public.contacts, public.wa_conversations, public.wa_messages,
  public.wa_labels, public.wa_conversation_labels, public.wa_quick_replies,
  public.wa_internal_notes, public.audit_log
from anon, authenticated;

grant all on table
  public.staff_profiles, public.contacts, public.wa_conversations, public.wa_messages,
  public.wa_labels, public.wa_conversation_labels, public.wa_quick_replies,
  public.wa_internal_notes, public.audit_log
to service_role;

grant select on table
  public.staff_profiles, public.contacts, public.wa_conversations, public.wa_messages,
  public.wa_labels, public.wa_conversation_labels, public.wa_quick_replies,
  public.wa_internal_notes, public.audit_log
to authenticated;

grant insert (id, full_name, email, role, is_active),
      update (full_name, email, role, is_active)
  on public.staff_profiles to authenticated;

-- phone / whatsapp_profile_name are set by the webhook, not edited by staff.
grant insert (phone, name, email, organization, city, requirement, notes, marketing_opt_in, opt_in_at, opt_in_source),
      update (name, email, organization, city, requirement, notes, marketing_opt_in, opt_in_at, opt_in_source, opted_out, opted_out_at)
  on public.contacts to authenticated;

-- Conversations are created by the webhook/server; staff change workflow fields only.
grant update (status, assigned_staff_id, unread_count) on public.wa_conversations to authenticated;

-- wa_messages: SELECT only for staff. Messages are written by the server
-- after a real Graph API call, so nobody can fake a "sent" message via the API.

grant insert (name, color, emoji), update (name, color, emoji), delete on public.wa_labels to authenticated;
grant insert (conversation_id, label_id, added_by), delete on public.wa_conversation_labels to authenticated;
grant insert (shortcut, title, body, category, scope, owner_id),
      update (shortcut, title, body, category), delete
  on public.wa_quick_replies to authenticated;
grant insert (conversation_id, author_id, body), update (body), delete on public.wa_internal_notes to authenticated;

-- audit_log: SELECT only (admins, via RLS). Rows come from triggers.

-- Functions: webhook functions are service_role only; RLS helpers are
-- callable by authenticated (policies run as the caller); trigger/audit
-- functions are callable by nobody directly.
revoke all on function public.wa_ingest_inbound(text, text, text, text, text, text, timestamptz) from public, anon, authenticated;
revoke all on function public.wa_apply_status(text, text, timestamptz, integer, text) from public, anon, authenticated;
grant execute on function public.wa_ingest_inbound(text, text, text, text, text, text, timestamptz) to service_role;
grant execute on function public.wa_apply_status(text, text, timestamptz, integer, text) to service_role;

revoke all on all functions in schema private from public, anon, authenticated;
grant execute on function private.current_staff_role(), private.is_active_staff(), private.is_admin() to authenticated;

alter table public.staff_profiles          enable row level security;
alter table public.contacts                enable row level security;
alter table public.wa_conversations        enable row level security;
alter table public.wa_messages             enable row level security;
alter table public.wa_labels               enable row level security;
alter table public.wa_conversation_labels  enable row level security;
alter table public.wa_quick_replies        enable row level security;
alter table public.wa_internal_notes       enable row level security;
alter table public.audit_log               enable row level security;

-- Policies target `authenticated` only; anon has no policies (and no grants).
-- Helper calls are wrapped in (select …) so Postgres evaluates them once per
-- statement instead of once per row.

-- staff_profiles: active staff see the team (for the assignment picker);
-- anyone signed in can see their own row (so the app can show "no access").
create policy "staff_profiles: read own row or team if active staff"
  on public.staff_profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_active_staff()));
create policy "staff_profiles: admins add staff"
  on public.staff_profiles for insert to authenticated
  with check ((select private.is_admin()));
create policy "staff_profiles: admins update staff"
  on public.staff_profiles for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- contacts
create policy "contacts: active staff read"
  on public.contacts for select to authenticated
  using ((select private.is_active_staff()));
create policy "contacts: active staff add"
  on public.contacts for insert to authenticated
  with check ((select private.is_active_staff()));
create policy "contacts: active staff update"
  on public.contacts for update to authenticated
  using ((select private.is_active_staff())) with check ((select private.is_active_staff()));

-- wa_conversations (assignment rules enforced by guard_wa_conversation_update)
create policy "wa_conversations: active staff read"
  on public.wa_conversations for select to authenticated
  using ((select private.is_active_staff()));
create policy "wa_conversations: active staff update workflow fields"
  on public.wa_conversations for update to authenticated
  using ((select private.is_active_staff())) with check ((select private.is_active_staff()));

-- wa_messages (read-only for staff)
create policy "wa_messages: active staff read"
  on public.wa_messages for select to authenticated
  using ((select private.is_active_staff()));

-- wa_labels
create policy "wa_labels: active staff read"
  on public.wa_labels for select to authenticated
  using ((select private.is_active_staff()));
create policy "wa_labels: admins create"
  on public.wa_labels for insert to authenticated
  with check ((select private.is_admin()));
create policy "wa_labels: admins edit"
  on public.wa_labels for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "wa_labels: admins delete custom labels"
  on public.wa_labels for delete to authenticated
  using ((select private.is_admin()) and not is_system);

-- wa_conversation_labels
create policy "wa_conversation_labels: active staff read"
  on public.wa_conversation_labels for select to authenticated
  using ((select private.is_active_staff()));
create policy "wa_conversation_labels: active staff add as themselves"
  on public.wa_conversation_labels for insert to authenticated
  with check ((select private.is_active_staff()) and added_by = (select auth.uid()));
create policy "wa_conversation_labels: active staff remove"
  on public.wa_conversation_labels for delete to authenticated
  using ((select private.is_active_staff()));

-- wa_quick_replies: team replies visible to all staff, managed by admins;
-- personal replies visible to and managed by their owner only.
create policy "wa_quick_replies: read team + own personal"
  on public.wa_quick_replies for select to authenticated
  using ((select private.is_active_staff()) and (scope = 'team' or owner_id = (select auth.uid())));
create policy "wa_quick_replies: create own personal or team (admin)"
  on public.wa_quick_replies for insert to authenticated
  with check (
    (select private.is_active_staff()) and (
      (scope = 'personal' and owner_id = (select auth.uid())) or
      (scope = 'team' and owner_id is null and (select private.is_admin()))
    )
  );
create policy "wa_quick_replies: edit own personal or team (admin)"
  on public.wa_quick_replies for update to authenticated
  using (
    (select private.is_active_staff()) and (
      (scope = 'personal' and owner_id = (select auth.uid())) or
      (scope = 'team' and (select private.is_admin()))
    )
  )
  with check (
    (select private.is_active_staff()) and (
      (scope = 'personal' and owner_id = (select auth.uid())) or
      (scope = 'team' and (select private.is_admin()))
    )
  );
create policy "wa_quick_replies: delete own personal or team (admin)"
  on public.wa_quick_replies for delete to authenticated
  using (
    (select private.is_active_staff()) and (
      (scope = 'personal' and owner_id = (select auth.uid())) or
      (scope = 'team' and (select private.is_admin()))
    )
  );

-- wa_internal_notes: visible to all active staff; authors edit their own;
-- authors or admins delete.
create policy "wa_internal_notes: active staff read"
  on public.wa_internal_notes for select to authenticated
  using ((select private.is_active_staff()));
create policy "wa_internal_notes: active staff add as themselves"
  on public.wa_internal_notes for insert to authenticated
  with check ((select private.is_active_staff()) and author_id = (select auth.uid()));
create policy "wa_internal_notes: authors edit own"
  on public.wa_internal_notes for update to authenticated
  using ((select private.is_active_staff()) and author_id = (select auth.uid()))
  with check ((select private.is_active_staff()) and author_id = (select auth.uid()));
create policy "wa_internal_notes: authors or admins delete"
  on public.wa_internal_notes for delete to authenticated
  using ((select private.is_active_staff()) and (author_id = (select auth.uid()) or (select private.is_admin())));

-- audit_log: admins only.
create policy "audit_log: admins read"
  on public.audit_log for select to authenticated
  using ((select private.is_admin()));


-- -----------------------------------------------------------------------------
-- 7. Seed data
-- -----------------------------------------------------------------------------

insert into public.wa_labels (name, emoji, color, is_system) values
  ('New Enquiry', '🔵', '#2563EB', true),
  ('Follow Up',   '🟡', '#B9791B', true),
  ('Hot Lead',    '🔴', '#B42318', true),
  ('NABH',        '🟢', '#22645B', true),
  ('CEA',         '🟣', '#6F3F60', true),
  ('Recruitment', '🟠', '#A3572F', true),
  ('Marketing',   '🟤', '#6E5630', true)
on conflict do nothing;

-- Team quick replies — wording exactly as supplied in the EMC Inbox brief.
insert into public.wa_quick_replies (shortcut, title, body, category, scope) values
  ('hello',   'Greeting',            'Hello! Greetings from EMC Healthcare Services Pvt. Ltd. How can we help you?', 'General', 'team'),
  ('nabh',    'NABH enquiry',        'Our team can assist you with NABH & Quality Accreditation. Please share your hospital/clinic name and your requirement.', 'Services', 'team'),
  ('call',    'Will call back',      'Sure. Our team will contact you shortly.', 'General', 'team'),
  ('details', 'Ask for details',     'Please share your name, hospital/clinic name, city and requirement. Our team will assist you.', 'General', 'team')
on conflict do nothing;
