import Image from "next/image";
import { Icon } from "../ui/Icon";

/** Visual for sections or items added from the admin panel: their image, or their icon with soft rings. */
export function GenericScene({ image, icon, sizes = "(max-width: 560px) 50vw, 300px" }: { image?: string; icon: string; sizes?: string }) {
  if (image) {
    return (
      <span className="gscene gscene--image">
        <Image src={image} alt="" fill sizes={sizes} />
      </span>
    );
  }
  return (
    <span className="gscene" aria-hidden="true">
      <i />
      <i />
      <i />
      <b>
        <Icon name={icon} />
      </b>
    </span>
  );
}
