import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

/** Image d ambiance en fond, toujours derriere un overlay CSS. */
export function SoftCover({
  src,
  alt = "",
  priority = false,
  className = "",
  sizes = "(max-width: 720px) 100vw, 680px",
}: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`app-media ${className}`.trim()}
    />
  );
}
