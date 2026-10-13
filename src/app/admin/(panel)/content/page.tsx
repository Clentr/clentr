import { builtIn, templates } from "@/content/cms";
import { getSiteForAdmin } from "@/lib/content";
import { PageHead } from "../../_ui/kit";
import { Outline } from "./Outline";

// Live data on every request.
export const instant = false;

export const metadata = { title: "Home page" };

export default async function Content() {
  const { edits, layout, sections } = await getSiteForAdmin();
  const rows = layout.order.map((id) => {
    const custom = sections.find((s) => `s:${s.id}` === id);
    if (custom) {
      const t = templates[custom.template];
      return { id, href: `/admin/content/${custom.id}`, name: custom.name, about: t.name, icon: t.icon, custom: true, edited: true };
    }
    const d = builtIn[id as keyof typeof builtIn];
    return { id, href: `/admin/content/${id}`, name: d.name, about: d.about, icon: d.icon, custom: false, edited: id in edits };
  });
  const tpls = Object.entries(templates).map(([k, t]) => ({ k, name: t.name, about: t.about, icon: t.icon }));

  return (
    <>
      <PageHead
        title="Home page"
        sub="Every section on clentr.com, top to bottom. Reorder, hide, edit the text — or add a new section in the same design."
      />
      <Outline rows={rows} layout={layout} templates={tpls} contactEdited={"contact" in edits} contactAbout={builtIn.contact.about} />
    </>
  );
}
