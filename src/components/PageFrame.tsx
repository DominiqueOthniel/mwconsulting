import type { ReactNode } from "react";

export function PageFrame({
  kicker,
  title,
  actions,
  children,
}: {
  kicker?: string;
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="page">
      {kicker || title || actions ? (
        <header className="page-head">
          <div>
            {kicker ? <p className="kicker">{kicker}</p> : null}
            {title ? <h1 className="page-title">{title}</h1> : null}
          </div>
          {actions}
        </header>
      ) : null}
      {children}
    </div>
  );
}
