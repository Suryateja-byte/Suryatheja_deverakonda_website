interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  alignment?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, description, alignment = 'left' }: SectionHeadingProps) {
  return (
    <div
      className={
        alignment === 'center'
          ? 'mx-auto max-w-3xl text-center'
          : 'max-w-3xl'
      }
    >
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h2>
      {description ? <p className="mt-3 text-base text-muted-foreground">{description}</p> : null}
    </div>
  );
}
