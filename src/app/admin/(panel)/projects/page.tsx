import Link from "next/link";
import { Plus } from "lucide-react";
import { projects as builtInProjects, type Project } from "@/content/projects";
import { serviceClient } from "@/lib/supabase/service";
import { PageHead } from "../../_ui/kit";
import { ProjectGrid, type ProjectRow } from "./ProjectGrid";

// Live data on every request.
export const instant = false;

export const metadata = { title: "Projects" };

export default async function Projects({ searchParams }: PageProps<"/admin/projects">) {
  const { saved } = await searchParams;
  const { data } = (await serviceClient()?.from("projects").select("slug, published, updated_at, data").order("sort").order("created_at")) ?? {};
  const rows = new Map((data ?? []).map((r) => [r.slug as string, r]));

  const list: ProjectRow[] = [
    ...builtInProjects.map((p) => {
      const r = rows.get(p.slug);
      const merged: Project = r ? { ...(r.data as Project), slug: p.slug } : p;
      return { p: merged, source: r ? ("edited" as const) : ("builtin" as const), visible: r ? Boolean(r.published) : true };
    }),
    ...(data ?? [])
      .filter((r) => !builtInProjects.some((p) => p.slug === r.slug))
      .map((r) => ({ p: { ...(r.data as Project), slug: r.slug as string }, source: "added" as const, visible: Boolean(r.published) })),
  ];

  return (
    <>
      <PageHead title="Projects" sub="Every case study on the site. Add new ones, edit the text, hide or remove any of them.">
        <Link href="/admin/projects/new" className="ad-btn ad-btn--primary">
          <Plus />
          New project
        </Link>
      </PageHead>
      {saved && <p className="ad-banner ad-banner--ok">Saved “{saved}” — changes are live.</p>}
      <ProjectGrid rows={list} />
    </>
  );
}
