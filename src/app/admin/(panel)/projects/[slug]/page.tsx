import { notFound } from "next/navigation";
import { projects as builtInProjects, type Project } from "@/content/projects";
import { serviceClient } from "@/lib/supabase/service";
import { PageHead } from "../../../_ui/kit";
import { ProjectForm } from "../ProjectForm";

// Live data on every request.
export const instant = false;

export const metadata = { title: "Edit project" };

export default async function EditProject({ params }: PageProps<"/admin/projects/[slug]">) {
  const { slug } = await params;
  const { data } = (await serviceClient()?.from("projects").select("slug, published, sort, data").eq("slug", slug).maybeSingle()) ?? {};
  const base = builtInProjects.find((p) => p.slug === slug);
  if (!data && !base) notFound();
  const project: Project = data ? { ...(data.data as Omit<Project, "slug">), slug } : base!;
  return (
    <>
      <PageHead
        title={project.name}
        sub={base ? "Built-in project — edit the text, keep the Figma artwork or replace it with screenshots." : "Changes go live as soon as you save."}
      />
      <ProjectForm
        project={project}
        builtIn={Boolean(base)}
        published={data ? Boolean(data.published) : true}
        sort={(data?.sort as number) ?? builtInProjects.indexOf(base!)}
      />
    </>
  );
}
