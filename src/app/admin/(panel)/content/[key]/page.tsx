import { notFound } from "next/navigation";
import { builtIn, defaults, templates, type SectionKey } from "@/content/cms";
import { getSiteForAdmin } from "@/lib/content";
import { SectionEditor } from "../../../_ui/SectionEditor";

// Live data on every request.
export const instant = false;

export const metadata = { title: "Edit section" };

export default async function EditSection({ params }: PageProps<"/admin/content/[key]">) {
  const { key } = await params;
  const { edits, layout, sections } = await getSiteForAdmin();

  if (key in builtIn) {
    const k = key as SectionKey;
    const d = builtIn[k];
    const initial = { ...structuredClone(defaults[k]), ...(edits[k] ?? {}) } as Record<string, unknown>;
    return (
      <SectionEditor
        kind="builtin"
        id={k}
        layoutId={k === "contact" ? null : k}
        name={d.name}
        about={d.about}
        icon={d.icon}
        fields={d.fields}
        initial={initial}
        anchor={d.anchor ?? null}
        layout={layout}
        edited={k in edits}
      />
    );
  }

  const s = sections.find((x) => x.id === key);
  if (!s) notFound();
  const t = templates[s.template];
  return (
    <SectionEditor
      kind="custom"
      id={s.id}
      layoutId={`s:${s.id}`}
      name={s.name}
      about={`${t.name} — ${t.about}`}
      icon={t.icon}
      fields={t.fields}
      initial={s.data}
      anchor={`s-${s.id.slice(0, 8)}`}
      layout={layout}
      edited
    />
  );
}
