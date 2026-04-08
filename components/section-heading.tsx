type SectionHeadingProps = {
  label: string;
  title: string;
  subtitle: string;
};

export function SectionHeading({
  label,
  title,
  subtitle
}: SectionHeadingProps) {
  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/8" />
        <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[var(--muted)]">
          {label}
        </span>
        <div className="h-px flex-1 bg-white/8" />
      </div>

      <h2 className="text-4xl font-black tracking-tight md:text-5xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--muted)]">
        {subtitle}
      </p>
    </div>
  );
}