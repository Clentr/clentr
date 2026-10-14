import { notFound } from "next/navigation";
import { readLibrary } from "@/lib/resources";
import { PageHead } from "../../../_ui/kit";
import { ResourceForm } from "../ResourceForm";

// Live data on every request.
export const instant = false;

export const metadata = { title: "Edit resource" };

export default async function EditResource({ params }: PageProps<"/admin/resources/[id]">) {
  const { id } = await params;
  const lib = await readLibrary();
  const resource = lib.items.find((r) => r.id === id);
  if (!resource) notFound();
  const categories = [...new Set(lib.items.map((r) => r.category))];
  return (
    <>
      <PageHead title={resource.title} sub="Changes go live as soon as you save." />
      <ResourceForm id={id} resource={resource} categories={categories} sort={resource.sort} />
    </>
  );
}
