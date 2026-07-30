import Image from "next/image";
import {
  customerTestimonials,
  featureVideos,
  elongatedMeshRows,
  machineSpecificationGroups,
  meshAvailableImages,
  miniEquipmentImages,
  screenMaterials,
  seoFaqs,
  slg56Audiences,
  squareMeshRows,
  watchActionVideos,
} from "@/lib/site-data";
import { DeferredVideo } from "@/components/DeferredVideo";
import { FeatureVideoSlider } from "@/components/FeatureVideoSlider";
import { Header } from "@/components/Header";
import { MachineSpecifications } from "@/components/MachineSpecifications";
import { MeshSection } from "@/components/MeshSection";
import { PriceBadge } from "@/components/PriceBadge";
import { PurchaseQuestionnaire } from "@/components/PurchaseQuestionnaire";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { StructuredData } from "@/components/StructuredData";
import { TestimonialsSlider } from "@/components/TestimonialsSlider";
import { WatchActionVideos } from "@/components/WatchActionVideos";
import { getStructuredData } from "@/lib/structured-data";

const defaultPrice = {
  amount: "$4,500",
  currency: "USD",
};

export default function Home() {
  return (
    <>
      <StructuredData data={getStructuredData()} />
      <Header />
      <main id="contenido">
        <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#020617_0%,#073d8f_42%,#0b63ce_72%,#7dd3fc_100%)] px-4 py-10 text-white sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.04)_34%,rgba(2,6,23,0.32)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.09)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.09)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />

          <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
            <h1 className="max-w-6xl text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              The first Mini screener for mini equipment in the entire industry
            </h1>

            <div className="mt-7 w-full max-w-6xl rounded-lg border border-white/25 bg-white/12 p-1.5 shadow-soft backdrop-blur-md sm:mt-9 sm:p-2.5">
              <DeferredVideo
                provider="vimeo"
                id="1006286529"
                thumbnailSrc="/video-thumbnails/hero.webp"
                priority
                title="The first Mini screener for mini equipment in the entire industry"
              />
            </div>

            <div className="mt-5 inline-flex items-center rounded-full border border-white/25 bg-white/16 px-5 py-3 shadow-soft backdrop-blur-md sm:mt-6 sm:px-8 sm:py-4">
              <span className="text-2xl font-bold text-white sm:text-4xl">
                <PriceBadge initialPrice={defaultPrice} />
              </span>
            </div>
          </div>
        </section>

        <section
          id="who-for"
          className="section-shell bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading
                eyebrow="Who it's for"
                title="Who Is the SLG 56 For?"
                description="The SLG 56 is designed for compact operations that need practical screening power without oversized equipment."
              />
            </Reveal>

            <div className="mt-9 grid gap-3 sm:mt-11 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {slg56Audiences.map((audience, index) => (
                <Reveal key={audience} delay={index * 45}>
                  <article className="flex min-h-16 items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:shadow-soft sm:min-h-20 sm:p-4">
                    <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <h3 className="text-sm font-bold leading-6 text-ink sm:text-base">
                      {audience}
                    </h3>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="equipment"
          className="section-shell bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading
                eyebrow="Equipment fit"
                title="Purpose built for your mini equipment"
                description="The SLG 56 pairs with compact machines that need reliable screening performance without moving up to oversized equipment."
              />
            </Reveal>

            <div className="mt-9 grid gap-5 sm:mt-11 sm:grid-cols-2 lg:grid-cols-3">
              {miniEquipmentImages.map((image, index) => (
                <Reveal key={image.src} delay={index * 100}>
                  <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-soft">
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-50 via-white to-slate-100">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 31vw, (min-width: 768px) 33vw, 100vw"
                        quality={70}
                        className="object-contain p-4 sm:p-6"
                      />
                    </div>
                    <div className="border-t border-slate-200 p-5">
                      <h3 className="text-lg font-bold text-ink">{image.label}</h3>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="features"
          className="section-shell bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading
                eyebrow="Features"
                title="Built with the features compact operators need"
                description="Explore the SLG 56 in action through quick feature videos that show its compact fit, simple workflow and real material screening performance."
              />
            </Reveal>

            <Reveal>
              <FeatureVideoSlider videos={featureVideos} />
            </Reveal>
          </div>
        </section>

        <section
          id="watch-action"
          className="section-shell bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold uppercase text-brand-600">Video demos</p>
                <h2 className="mt-4 text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
                  Watch in Action
                </h2>
              </div>
            </Reveal>

            <Reveal>
              <WatchActionVideos videos={watchActionVideos} />
            </Reveal>
          </div>
        </section>

        <section
          id="materials"
          className="section-shell bg-[linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <div className="mx-auto max-w-5xl text-center">
                <p className="text-sm font-semibold uppercase text-brand-600">Screening range</p>
                <h2 className="mt-4 text-2xl font-bold leading-tight text-ink sm:text-3xl lg:text-4xl">
                  With your DeSite SLG 56 Mini Screener you can screen for:
                </h2>
                <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  From landscaping materials to recycled aggregates, the SLG 56 helps compact
                  crews separate usable material with a simple, efficient workflow.
                </p>
              </div>
            </Reveal>

            <div className="mt-9 grid grid-cols-2 gap-3 sm:mt-11 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
              {screenMaterials.map((material, index) => (
                <Reveal key={material.name} delay={(index % 6) * 45}>
                  <article className="group h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <Image
                        src={material.image}
                        alt={material.alt}
                        fill
                        sizes="(min-width: 1280px) 15vw, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 46vw"
                        quality={58}
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/24 via-transparent to-white/10" />
                    </div>
                    <div className="flex min-h-16 items-center p-3 sm:p-4">
                      <h3 className="text-sm font-bold leading-5 text-ink sm:text-base">
                        {material.name}
                      </h3>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>

          </div>
        </section>

        <section
          id="mesh"
          className="section-shell bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
          <Reveal>
            <MeshSection
              elongatedRows={elongatedMeshRows}
              images={meshAvailableImages}
              squareRows={squareMeshRows}
            />
          </Reveal>
        </section>

        <section
          id="specifications"
          className="section-shell bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
          <Reveal>
            <MachineSpecifications groups={machineSpecificationGroups} />
          </Reveal>
        </section>

        <section
          id="purchase-form"
          className="section-shell relative isolate overflow-hidden bg-[linear-gradient(135deg,#020617_0%,#063a7a_48%,#0b63ce_100%)] px-4 py-14 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24"
        >
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20" />
          <div className="absolute inset-x-0 top-0 -z-10 h-px bg-white/30" />

          <div className="mx-auto max-w-4xl">
            <Reveal>
              <PurchaseQuestionnaire />
            </Reveal>
          </div>
        </section>

        <section
          id="testimonials"
          className="section-shell bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <SectionHeading
                eyebrow="Customer feedback"
                title="What customers say"
              />
            </Reveal>

            <Reveal>
              <TestimonialsSlider testimonials={customerTestimonials} />
            </Reveal>
          </div>
        </section>

        <section
          id="faq"
          className="section-shell bg-slate-50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-5xl">
            <Reveal>
              <SectionHeading
                eyebrow="FAQ"
                title="Questions customers ask about the SLG 56"
                description="Clear answers about equipment fit, screening materials, mesh options, dimensions, warranty, shipping and bucket width for the DeSite SLG 56 Mini Screener."
              />
            </Reveal>

            <div className="mt-9 grid gap-4 sm:mt-11">
              {seoFaqs.map((faq, index) => (
                <Reveal key={faq.question} delay={index * 60}>
                  <article className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-6">
                    <h3 className="text-lg font-bold leading-7 text-ink">{faq.question}</h3>
                    <p className="mt-3 text-base leading-7 text-slate-600">{faq.answer}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-base font-bold tracking-wide sm:text-left">
            DeSite Products 2026
          </p>

          <address className="flex flex-col items-center gap-3 text-sm not-italic sm:items-end">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-sky-200">
              Sales Contact
            </h2>
            <div className="flex w-full flex-col gap-2 min-[480px]:w-auto min-[480px]:flex-row">
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 bg-white/10 px-4 py-3 font-semibold text-white transition hover:border-sky-300/60 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                href="tel:8065003915"
              >
                806-500-3915
              </a>
              <a
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/15 bg-white/10 px-4 py-3 font-semibold text-white transition hover:border-sky-300/60 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                href="mailto:sales@desiteproducts.com"
              >
                sales@desiteproducts.com
              </a>
            </div>
          </address>
        </div>
      </footer>
    </>
  );
}
