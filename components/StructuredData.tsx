import { SITE } from '@/lib/utils';

export default function StructuredData() {
  const json = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalBusiness',
        '@id': `${SITE.url}/#business`,
        name: SITE.name,
        url: SITE.url,
        email: SITE.email,
        telephone: SITE.phones[0],
        description: SITE.description,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'No. 24, Thiruvallurpuram 2nd Street, Choolaimedu',
          addressLocality: 'Chennai',
          postalCode: '600094',
          addressRegion: 'TN',
          addressCountry: 'IN',
        },
        sameAs: [
          SITE.socials.facebook,
          SITE.socials.instagram,
          SITE.socials.linkedin,
          SITE.socials.twitter,
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        publisher: { '@id': `${SITE.url}/#business` },
        inLanguage: 'en-IN',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
