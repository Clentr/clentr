import Link from "next/link";
import { Plus } from "lucide-react";
import { readLibrary } from "@/lib/resources";
import { PageHead } from "../../_ui/kit";
import { LibraryCopy } from "./LibraryCopy";
import { ResourceList } from "./ResourceList";

// Live data on every request.
export const instant = false;

export const metadata = { title: "Resources" };

export default async function Resources({ searchParams }: PageProps<"/admin/resources">) {
  const { saved } = await searchParams;
  const lib = await readLibrary();
  return (
    <>
      <PageHead
        title="Resources"
        sub={
          <>
            The free library at <a href="/resources" target="_blank" rel="noopener">/resources</a>. Share{" "}
            <code>clentr.com/free</code> on Instagram — visitors see the home page first, then the library.
          </>
        }
      >
        <Link href="/admin/resources/new" className="ad-btn ad-btn--primary">
          <Plus />
          New resource
        </Link>
      </PageHead>
      {saved && <p className="ad-banner ad-banner--ok">Saved “{saved}”.</p>}
      <ResourceList items={lib.items} />
      <LibraryCopy title={lib.title} dim={lib.dim} lead={lib.lead} />
    </>
  );
}
