import Script from "next/script";

/**
 * Measurement.
 *
 * Nothing here fires unless the corresponding environment variable is set, so
 * the demo build stays clean and no placeholder id ever reaches a real
 * endpoint — the same discipline `lib/brand.ts` applies to the WhatsApp number.
 *
 * To switch measurement on, set either or both:
 *   NEXT_PUBLIC_GA_ID          e.g. G-XXXXXXXXXX
 *   NEXT_PUBLIC_META_PIXEL_ID  e.g. 1234567890
 *
 * Consent: both tags are configured to anonymise IPs and to leave ad
 * personalisation off by default. If this store later sells into jurisdictions
 * requiring opt-in, gate `<Analytics />` behind the consent state rather than
 * unpicking the tags themselves.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function Analytics() {
  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                anonymize_ip: true,
                allow_google_signals: false,
                currency: 'PKR'
              });
            `}
          </Script>
        </>
      )}

      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
