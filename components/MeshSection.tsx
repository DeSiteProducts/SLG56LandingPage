import Image from "next/image";

type MeshImage = {
  alt: string;
  label: string;
  src: string;
};

type MeshRow = {
  meshSize: string;
  pattern: string;
  productSize: string;
};

type MeshSectionProps = {
  elongatedRows: MeshRow[];
  images: MeshImage[];
  squareRows: MeshRow[];
};

function MeshTable({ rows, title }: { rows: MeshRow[]; title: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <h3 className="border-b border-slate-200 bg-slate-50 px-3 py-4 text-center text-lg font-bold leading-tight text-ink sm:px-4 sm:text-2xl">
        {title}
      </h3>

      <table className="w-full table-fixed border-separate border-spacing-0 text-left">
        <colgroup>
          <col className="w-[38%]" />
          <col className="w-[28%]" />
          <col className="w-[34%]" />
        </colgroup>
        <thead>
          <tr>
            <th className="break-words px-3 py-3 text-[12px] font-bold leading-4 text-ink min-[390px]:text-sm sm:px-5 sm:py-4 sm:text-base">
              Mesh Size
            </th>
            <th className="break-words px-3 py-3 text-[12px] font-bold leading-4 text-ink min-[390px]:text-sm sm:px-5 sm:py-4 sm:text-base">
              Pattern
            </th>
            <th className="break-words px-3 py-3 text-[12px] font-bold leading-4 text-ink min-[390px]:text-sm sm:px-5 sm:py-4 sm:text-base">
              Product Size
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${title}-${row.meshSize}`} className="odd:bg-slate-100">
              <td className="break-words px-3 py-3 text-[12px] font-semibold leading-5 text-ink min-[390px]:text-sm sm:px-5">
                {row.meshSize}
              </td>
              <td className="break-words px-3 py-3 text-[12px] leading-5 text-slate-700 min-[390px]:text-sm sm:px-5">
                {row.pattern}
              </td>
              <td className="break-words px-3 py-3 text-[12px] leading-5 text-slate-700 min-[390px]:text-sm sm:px-5">
                {row.productSize}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MeshSection({ elongatedRows, images, squareRows }: MeshSectionProps) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase text-brand-600">Mesh options</p>
        <h2 className="mt-4 text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
          Mesh Available
        </h2>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:mt-10 sm:grid-cols-2">
        {images.map((image) => (
          <article
            key={image.src}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft"
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 via-white to-brand-50">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 44vw, 100vw"
                quality={70}
                className="object-contain p-5 sm:p-7"
              />
            </div>
            <div className="border-t border-slate-200 p-4 text-center">
              <h3 className="text-base font-bold text-ink">{image.label}</h3>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 sm:mt-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
            Mesh Chart
          </h2>
        </div>

        <div className="mx-auto mt-8 max-w-5xl space-y-6 sm:mt-10 sm:space-y-8">
          <MeshTable rows={squareRows} title="Square" />
          <MeshTable rows={elongatedRows} title="Elongated" />
        </div>
      </div>
    </div>
  );
}
