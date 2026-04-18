import { ImageOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
};

export const ProductImage = ({ src, alt, className, imgClassName, eager }: Props) => {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const showFallback = !src || errored;

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!showFallback && (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      )}
      {showFallback && (
        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
          <ImageOff className="h-8 w-8" aria-hidden />
        </div>
      )}
    </div>
  );
};
