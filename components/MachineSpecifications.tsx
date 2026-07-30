type SpecificationRow = {
  label: string;
  value: string;
};

type SpecificationGroup = {
  rows: SpecificationRow[];
  title: string;
};

type MachineSpecificationsProps = {
  groups: SpecificationGroup[];
};

export function MachineSpecifications({ groups }: MachineSpecificationsProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 text-center shadow-sm sm:px-6 sm:py-7">
        <h2 className="text-2xl font-bold leading-tight text-brand-600 sm:text-3xl lg:text-4xl">
          Machine Specifications
        </h2>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:mt-8">
        {groups.map((group, groupIndex) => (
          <section key={group.title} aria-labelledby={`spec-${groupIndex}`}>
            <div className="bg-slate-100 px-4 py-4 sm:px-5">
              <h3
                id={`spec-${groupIndex}`}
                className="text-lg font-bold leading-tight text-ink sm:text-xl"
              >
                {group.title}
              </h3>
            </div>

            <dl>
              {group.rows.map((row, rowIndex) => (
                <div
                  key={row.label}
                  className={`grid gap-2 px-4 py-4 sm:grid-cols-2 sm:gap-6 sm:px-5 ${
                    rowIndex % 2 === 1 ? "bg-slate-100" : "bg-white"
                  }`}
                >
                  <dt className="text-sm font-bold text-ink sm:text-base">{row.label}</dt>
                  <dd className="text-sm text-slate-700 sm:text-base">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </div>
  );
}
