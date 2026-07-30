type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div className={isCentered ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <p className="text-sm font-semibold uppercase text-brand-600">{eyebrow}</p>
      <h2 className="mt-4 text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          {description}
        </p>
      ) : null}
    </div>
  );
}
