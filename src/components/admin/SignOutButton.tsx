import { signOut } from "@/app/admin/actions";

export default function SignOutButton({ className = "btn-secondary" }: { className?: string }) {
  return (
    <form action={signOut}>
      <button type="submit" className={className}>
        Sign out
      </button>
    </form>
  );
}
