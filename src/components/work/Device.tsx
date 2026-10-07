import Image from "next/image";
import type { Screen } from "@/content/projects";

/**
 * Phone frame drawn in CSS. Sizes are percentages of the stage, so the bezel,
 * corner radius and screen keep the same proportions at every breakpoint.
 * `framed={false}` is for images that already contain their own mockup.
 */
export function Device({ screen, framed, role, sizes }: { screen: Screen; framed: boolean; role: "main" | "side"; sizes: string }) {
  return (
    <div className={`device device--${role} ${framed ? "" : "device--bare"}`}>
      <div className="device__bezel">
        <div className="device__screen">
          <Image src={screen.src} alt={screen.alt} fill sizes={sizes} />
        </div>
      </div>
    </div>
  );
}
