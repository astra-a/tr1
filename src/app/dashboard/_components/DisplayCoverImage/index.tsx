import Image from "@/app/dashboard/_components/Image";
import { Media } from "@/payload-types";

export default function DisplayCoverImage({
  image,
  fill,
  sizes,
  wrappedClass = "relative z-2 shrink-0",
  imageClass = "size-16 rounded-xl opacity-100 object-cover max-md:w-18 max-md:h-18",
  lostClass = "size-16 rounded-xl max-md:w-18 max-md:h-18",
}: {
  image?: string | Media | null;
  fill?: boolean;
  sizes?: string;
  wrappedClass?: string;
  imageClass?: string;
  lostClass?: string;
}) {
  return (
    <div className={wrappedClass}>
      {!image ? (
        <></>
      ) : "string" === typeof image ? (
        <div
          className={`${lostClass} border border-s-stroke2 flex items-center justify-center bg-b-surface1 text-caption text-t-primary`}
        >
          Lost
        </div>
      ) : image?.url ? (
        fill ? (
          <Image
            className={imageClass}
            src={image.url}
            fill
            alt={image.alt}
            sizes={sizes}
          />
        ) : (
          <Image
            className={imageClass}
            src={image.url}
            width={image.width ?? 64}
            height={image.height ?? 64}
            alt={image.alt}
            sizes={sizes}
          />
        )
      ) : (
        <></>
      )}
    </div>
  );
}
