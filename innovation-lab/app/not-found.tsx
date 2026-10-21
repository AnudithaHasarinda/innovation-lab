import Link from "next/link";
import { EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-32">
      <EmptyState title="Page not found" action={<Link href="/" className="btn btn-primary">Back to the lab</Link>}>
        That experiment does not exist (yet). Head back to the lab to see what is available.
      </EmptyState>
    </div>
  );
}
