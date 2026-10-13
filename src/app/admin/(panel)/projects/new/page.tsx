import { PageHead } from "../../../_ui/kit";
import { ProjectForm } from "../ProjectForm";

// Live data on every request.
export const instant = false;

export const metadata = { title: "New project" };

export default function NewProject() {
  return (
    <>
      <PageHead title="New project" sub="Fill this in once — the folder, cards and full case-study page are built in the same design as the others." />
      <ProjectForm />
    </>
  );
}
