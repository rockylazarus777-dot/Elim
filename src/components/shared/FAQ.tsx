import { FAQItem } from "@/types/content";
import { JsonLd, faqSchema } from "@/components/seo/JsonLd";

export default function FAQ({ items, title = "Frequently asked questions" }: { items: FAQItem[]; title?: string }) {
  if (!items.length) return null;
  const schema = faqSchema(items);

  return (
    <section aria-labelledby="faq-heading">
      {schema ? <JsonLd data={schema} /> : null}
      <h2 id="faq-heading" className="text-display-md font-display text-ink-900">
        {title}
      </h2>
      <dl className="mt-8 divide-y divide-ink-100 rounded-2xl ring-1 ring-ink-100">
        {items.map((item) => (
          <div key={item.question} className="p-6">
            <dt className="text-base font-semibold text-ink-900">{item.question}</dt>
            <dd className="prose-content mt-2">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
