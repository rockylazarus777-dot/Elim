"use client";

import { useEffect, useState } from "react";
import type { StaffProfile } from "@/lib/auth/access";
import type { ContactPatch } from "@/lib/inbox/data";
import { contactDisplayName, formatPhone, type InboxConversation, type InboxNote, type InboxStaffMember } from "@/lib/inbox/model";
import { formatDateTime } from "@/lib/inbox/format";
import { CloseIcon, NoteIcon } from "@/components/admin/inbox/icons";
import { Avatar, StatusBadge } from "@/components/admin/inbox/ui";

type Props = {
  conversation: InboxConversation;
  me: StaffProfile;
  staffById: Map<string, InboxStaffMember>;
  notes: InboxNote[];
  onClose: () => void;
  onSaveContact: (patch: ContactPatch) => Promise<string | null>;
  onAddNote: (body: string) => Promise<string | null>;
  onDeleteNote: (noteId: string) => Promise<string | null>;
};

const inputClass =
  "mt-1 block w-full rounded-lg border-0 bg-white px-3 py-2 text-sm text-ink-900 ring-1 ring-inset ring-ink-200 placeholder:text-ink-400 focus:ring-2 focus:ring-sky-500";

const EDITABLE = [
  ["name", "Name", "text"],
  ["organization", "Hospital / clinic / organisation", "text"],
  ["city", "City", "text"],
  ["requirement", "Requirement", "text"],
  ["email", "Email", "email"],
] as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-2">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{label}</dt>
      <dd className="mt-0.5 break-words text-sm text-ink-900">{children}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-ink-100 px-5 py-4">
      <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-ink-500">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}

export default function DetailsPanel({ conversation, me, staffById, notes, onClose, onSaveContact, onAddNote, onDeleteNote }: Props) {
  const contact = conversation.contact;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consentSource, setConsentSource] = useState("");
  const [noteText, setNoteText] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [noteSaving, setNoteSaving] = useState(false);

  useEffect(() => {
    setEditing(false);
    setError(null);
    setConsentSource("");
    setNoteText("");
    setNoteError(null);
  }, [conversation.id]);

  function startEditing() {
    setForm({
      name: contact.name ?? "",
      organization: contact.organization ?? "",
      city: contact.city ?? "",
      requirement: contact.requirement ?? "",
      email: contact.email ?? "",
      notes: contact.notes ?? "",
    });
    setError(null);
    setEditing(true);
  }

  async function save(patch: ContactPatch, after?: () => void) {
    setSaving(true);
    setError(null);
    const failure = await onSaveContact(patch);
    setSaving(false);
    if (failure) setError(failure);
    else after?.();
  }

  function saveForm(e: React.FormEvent) {
    e.preventDefault();
    const clean = (v: string | undefined) => (v?.trim() ? v.trim() : null);
    void save(
      {
        name: clean(form.name),
        organization: clean(form.organization),
        city: clean(form.city),
        requirement: clean(form.requirement),
        email: clean(form.email),
        notes: clean(form.notes),
      },
      () => setEditing(false),
    );
  }

  async function submitNote(e: React.FormEvent) {
    e.preventDefault();
    const body = noteText.trim();
    if (!body) return;
    setNoteSaving(true);
    setNoteError(null);
    const failure = await onAddNote(body);
    setNoteSaving(false);
    if (failure) setNoteError(failure);
    else setNoteText("");
  }

  const assignee = conversation.assigned_staff_id ? staffById.get(conversation.assigned_staff_id) : undefined;
  const name = contactDisplayName(contact);

  return (
    <aside aria-label="Customer details" className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
        <h2 className="font-display text-lg text-ink-900">Customer</h2>
        <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50 hover:text-ink-800" aria-label="Close customer details">
          <CloseIcon />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="flex flex-col items-center px-5 py-5 text-center">
          <Avatar name={name} size="lg" />
          <p className="mt-3 text-lg font-semibold text-ink-900">{name}</p>
          <p className="text-sm text-ink-600">{formatPhone(contact.phone)}</p>
          <div className="mt-2">
            <StatusBadge status={conversation.status} />
          </div>
        </div>

        <Section title="Details">
          {error && (
            <p role="alert" className="mb-2 rounded-lg bg-clay-50 px-3 py-2 text-sm text-clay-700 ring-1 ring-inset ring-clay-200">
              {error}
            </p>
          )}
          {editing ? (
            <form onSubmit={saveForm} className="space-y-3">
              {EDITABLE.map(([key, label, type]) => (
                <label key={key} className="block text-[13px] font-medium text-ink-700">
                  {label}
                  <input
                    type={type}
                    value={form[key] ?? ""}
                    maxLength={key === "requirement" ? 500 : 200}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    className={inputClass}
                  />
                </label>
              ))}
              <label className="block text-[13px] font-medium text-ink-700">
                Notes about this customer
                <textarea rows={3} maxLength={5000} value={form.notes ?? ""} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className={inputClass} />
              </label>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={saving} className="btn-primary px-5 py-2">
                  {saving ? "Saving…" : "Save"}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn-secondary px-5 py-2">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <dl className="divide-y divide-ink-100">
                <Row label="Name">{contact.name ?? <span className="text-ink-400">Not added</span>}</Row>
                <Row label="WhatsApp name">{contact.whatsapp_profile_name ?? "—"}</Row>
                <Row label="Phone">{formatPhone(contact.phone)}</Row>
                <Row label="Hospital / clinic">{contact.organization ?? "—"}</Row>
                <Row label="City">{contact.city ?? "—"}</Row>
                <Row label="Requirement">{contact.requirement ?? "—"}</Row>
                <Row label="Email">{contact.email ?? "—"}</Row>
                {contact.notes && <Row label="Notes about this customer">{contact.notes}</Row>}
                <Row label="Assigned to">{assignee ? (assignee.id === me.id ? "You" : assignee.full_name) : "Unassigned"}</Row>
                <Row label="Last message from customer">{formatDateTime(conversation.last_inbound_at)}</Row>
                <Row label="Customer since">{formatDateTime(contact.created_at)}</Row>
              </dl>
              <button type="button" onClick={startEditing} className="mt-2 text-sm font-semibold text-sky-700 hover:text-sky-800">
                Edit details
              </button>
            </>
          )}
        </Section>

        <Section title="Marketing consent">
          {contact.opted_out ? (
            <p className="rounded-lg bg-clay-50 px-3 py-2.5 text-sm text-clay-800 ring-1 ring-inset ring-clay-200">
              <span className="font-semibold">Opted out</span> on {formatDateTime(contact.opted_out_at)}. Never send this customer marketing
              messages. Replies to their own messages are still allowed.
            </p>
          ) : contact.marketing_opt_in ? (
            <div className="text-sm text-ink-800">
              <p>
                <span className="font-semibold text-brand-700">Opted in</span> on {formatDateTime(contact.opt_in_at)}
                {contact.opt_in_source && <> · {contact.opt_in_source}</>}
              </p>
              <button
                type="button"
                disabled={saving}
                onClick={() => void save({ marketing_opt_in: false })}
                className="mt-2 text-sm font-semibold text-clay-700 hover:text-clay-800"
              >
                Withdraw consent
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!consentSource.trim()) return;
                void save({ marketing_opt_in: true, opt_in_at: new Date().toISOString(), opt_in_source: consentSource.trim() }, () => setConsentSource(""));
              }}
            >
              <p className="text-sm text-ink-700">Not recorded — marketing messages must not be sent.</p>
              <label className="mt-2 block text-[13px] font-medium text-ink-700">
                Record consent — how did the customer agree?
                <input
                  value={consentSource}
                  maxLength={200}
                  onChange={(e) => setConsentSource(e.target.value)}
                  placeholder="e.g. Signed form at NABH camp, Chennai"
                  className={inputClass}
                />
              </label>
              <button type="submit" disabled={saving || !consentSource.trim()} className="btn-secondary mt-2 px-4 py-2">
                Record consent
              </button>
            </form>
          )}
        </Section>

        <Section title="Internal notes">
          <p className="mb-3 flex items-start gap-2 text-xs text-ink-500">
            <NoteIcon className="mt-px h-4 w-4 shrink-0" /> Visible to EMC staff only. Notes are never sent to the customer.
          </p>
          <ul className="space-y-2">
            {notes.map((note) => {
              const author = staffById.get(note.author_id);
              const canDelete = note.author_id === me.id || me.role === "admin";
              return (
                <li key={note.id} className="rounded-lg border-l-4 border-amber-400 bg-amber-50 px-3 py-2 text-sm text-ink-900">
                  <p className="whitespace-pre-wrap break-words">{note.body}</p>
                  <p className="mt-1 flex items-center justify-between gap-2 text-[11px] text-ink-500">
                    <span>
                      {note.author_id === me.id ? "You" : (author?.full_name ?? "Staff")} · {formatDateTime(note.created_at)}
                    </span>
                    {canDelete && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (!window.confirm("Delete this internal note?")) return;
                          const failure = await onDeleteNote(note.id);
                          if (failure) setNoteError(failure);
                        }}
                        className="font-semibold text-ink-500 hover:text-clay-700"
                      >
                        Delete
                      </button>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
          <form onSubmit={submitNote} className="mt-3">
            <label className="block text-[13px] font-medium text-ink-700">
              <span className="sr-only">New internal note</span>
              <textarea
                rows={3}
                maxLength={5000}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add an internal note, e.g. “Call tomorrow morning about NABH.”"
                className={`${inputClass} bg-amber-50/40`}
              />
            </label>
            {noteError && (
              <p role="alert" className="mt-1 text-sm text-clay-700">
                {noteError}
              </p>
            )}
            <button type="submit" disabled={noteSaving || !noteText.trim()} className="btn-secondary mt-2 px-4 py-2">
              {noteSaving ? "Saving…" : "Add note"}
            </button>
          </form>
        </Section>
      </div>
    </aside>
  );
}
