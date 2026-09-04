import * as React from "react";

const FALLBACK_SRC =
  "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='88' height='88' viewBox='0 0 88 88' fill='none'%3e%3crect width='88' height='88' rx='6' fill='%23F3F3F5'/%3e%3cpath d='M40.5 28h7a2 2 0 0 1 2 2v16.34l-4.36-3.98a2 2 0 0 0-2.66 0L34 50V30a2 2 0 0 1 2-2Z' fill='%23D0D2D8'/%3e%3ccircle cx='36' cy='34' r='2.5' fill='%23D0D2D8'/%3e%3c/svg%3e";

export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement>,
) {
  const [didError, setDidError] = React.useState(false);
  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div
      className={`inline-block bg-muted text-center align-middle ${className ?? ""}`}
      style={style}
    >
      <img
        src={FALLBACK_SRC}
        alt="Image unavailable"
        {...rest}
        className="mx-auto"
      />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={() => setDidError(true)}
    />
  );
}
