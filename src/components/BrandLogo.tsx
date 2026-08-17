export function BrandLogo({
  size = 56,
  withName = false,
}: {
  size?: number;
  withName?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo-mw.svg"
        alt="MW Consulting"
        width={size}
        height={size}
        style={{ width: size, height: size }}
      />
      {withName ? (
        <div>
          <p className="font-serif text-2xl leading-none tracking-tight">Relais</p>
          <p className="mt-1 text-xs opacity-70">MW Consulting</p>
        </div>
      ) : null}
    </div>
  );
}
