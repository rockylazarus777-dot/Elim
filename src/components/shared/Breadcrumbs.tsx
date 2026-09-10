import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/components/seo/JsonLd";

export interface Crumb {
  name: string;
  path: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const full = [{ name: "Home", path: "/" }, ...items];

  return (
    <>
      <JsonLd data={breadcrumbSchema(full)} />
      <nav aria-label="Breadcrumb" className="border-b border-ink-100 bg-ink-50/60">
        <ol className="container-page flex flex-wrap items-center gap-1.5 py-3 text-sm text-ink-500">
          {full.map((item, index) => {
            const isLast = index === full.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {index > 0 ? <span aria-hidden="true">/</span> : null}
                {isLast ? (
                  <span aria-current="page" className="font-medium text-ink-800">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="transition-colors hover:text-ink-800">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
