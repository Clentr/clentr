import { connection } from "next/server";
import { readLibrary } from "@/lib/resources";
import { PageHead } from "../../../_ui/kit";
import { ResourceForm } from "../ResourceForm";

// Live data on every request.
export const instant = false;

export const metadata = { title: "New resource" };

export default async function NewResource() {
  await connection();
  const lib = await readLibrary();
  const categories = [...new Set(lib.items.map((r) => r.category))];
  const id = `r-${crypto.randomUUID().slice(0, 8)}`;
  return (
    <>
      <PageHead title="New resource" sub="Upload a file or paste a link. It shows in the library as soon as it’s published." />
      <ResourceForm id={id} categories={categories} sort={lib.items.length} />
    </>
  );
}
