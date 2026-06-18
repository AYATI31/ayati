export function SectionHeading({
  eyebrow,
  title,
  children
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <p className="text-sm font-semibold uppercase tracking-normal text-ayati-teal">{eyebrow}</p> : null}
      <h1 className="mt-2 text-3xl font-semibold tracking-normal text-ayati-ink sm:text-4xl">{title}</h1>
      {children ? <div className="mt-4 text-base leading-7 text-ayati-muted">{children}</div> : null}
    </div>
  );
}
