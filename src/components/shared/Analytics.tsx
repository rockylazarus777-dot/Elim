import Script from "next/script";

/**
 * The single, centralized place tracking scripts are loaded — nowhere else
 * in the codebase should add a <script> tag for GTM, GA4, or the Meta
 * Pixel. Architecture:
 *
 *   Website events → dataLayer (src/lib/tracking.ts) → GTM → GA4 / Meta Pixel
 *
 * - NEXT_PUBLIC_GTM_ID set → GTM loads and becomes the SOLE tag manager.
 *   Configure the GA4 config tag and the Meta Pixel base/event tags inside
 *   the GTM container itself (using NEXT_PUBLIC_GA_MEASUREMENT_ID /
 *   NEXT_PUBLIC_META_PIXEL_ID below as the values to paste in), listening
 *   for the custom dataLayer events this site pushes (page_view,
 *   phone_click, email_click, whatsapp_click, cta_click, form_start,
 *   form_submit, lead — see src/lib/tracking.ts). GA4/Pixel are
 *   deliberately NOT also loaded directly in this mode — that would fire
 *   every event twice.
 * - NEXT_PUBLIC_GTM_ID NOT set → GA4 (gtag.js) and/or the Meta Pixel load
 *   directly instead, as a standalone fallback, so tracking still works
 *   without setting up GTM.
 *
 * Nothing renders, and no script loads, until the relevant env var is set —
 * see .env.example. No secret ever appears here: only public, client-safe
 * IDs (GTM container ID, GA4 Measurement ID, Meta Pixel ID) are read.
 */
export default function Analytics() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>
      {gtmId ? (
        // beforeInteractive + placed in the root layout's <head>: this is
        // Next.js's documented pattern for installing GTM as high in <head>
        // as the framework allows, matching GTM's own install instructions.
        // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- this rule only knows about pages/_document.js; the App Router's root layout is the documented, supported place for beforeInteractive scripts.
        <Script id="gtm-init" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}
        </Script>
      ) : null}

      {/* Direct GA4 fallback — only when GTM is absent, so GA4 never double-loads. */}
      {!gtmId && gaId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      ) : null}

      {/* Direct Meta Pixel fallback — only when GTM is absent, so the Pixel never double-loads. */}
      {!gtmId && pixelId ? (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  );
}

/** GTM's <noscript> fallback — rendered separately, immediately after <body>, by layout.tsx. */
export function GtmNoScript() {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
