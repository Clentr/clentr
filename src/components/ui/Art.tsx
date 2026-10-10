import Image from "next/image";
import sizes from "@/content/figma-sizes.json";

const SIZES = sizes as unknown as Record<string, [number, number]>;

type Props = {
  /** Export key without the theme suffix, e.g. "svc-mobile-apps". */
  name: string;
  alt: string;
  /** Light and dark exports exist (`-l` / `-d`); swap them with the theme. */
  themed?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Artwork exported from the Figma file. */
export function Art({ name, alt, themed, className, sizes: sz = "(max-width: 900px) 90vw, 600px", priority }: Props) {
  if (!themed) {
    const [w, h] = SIZES[name] ?? [400, 300];
    return <Image src={`/f/${name}.webp`} alt={alt} width={w} height={h} className={className} sizes={sz} priority={priority} />;
  }
  const [w, h] = SIZES[`${name}-l`] ?? [400, 300];
  return (
    <>
      <Image src={`/f/${name}-l.webp`} alt={alt} width={w} height={h} className={`${className ?? ""} only-light`} sizes={sz} priority={priority} />
      <Image src={`/f/${name}-d.webp`} alt={alt} width={w} height={h} className={`${className ?? ""} only-dark`} sizes={sz} priority={priority} />
    </>
  );
}
