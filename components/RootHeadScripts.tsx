import Script from 'next/script';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://www.isperm.com/#organization',
  name: 'iSperm Medical Limited',
  url: 'https://www.isperm.com',
  logo: 'https://www.isperm.com/iSperm%20LOGO.svg',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'market@isperm.com',
    contactType: 'Sales',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2F, Block B, Shenchengtou & Zhongcheng Life Science Park',
    addressLocality: 'Pingshan District',
    addressRegion: 'Shenzhen',
    addressCountry: 'CN',
  },
  sameAs: [
    'https://www.linkedin.com/company/isperm/',
    'https://www.facebook.com/profile.php?id=61579351030352',
  ],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Semen analyzer, CASA - iSperm Medical',
  url: 'https://www.isperm.com',
  publisher: {
    '@id': 'https://www.isperm.com/#organization',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.isperm.com/en/search/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

const navigationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    { '@type': 'SiteNavigationElement', position: 1, name: 'Home', url: 'https://www.isperm.com/en/' },
    { '@type': 'SiteNavigationElement', position: 2, name: 'Products', url: 'https://www.isperm.com/en/products/' },
    { '@type': 'SiteNavigationElement', position: 3, name: 'Nexus DX1', url: 'https://www.isperm.com/en/products/nexus-dx1/' },
    { '@type': 'SiteNavigationElement', position: 4, name: 'MSQA-100', url: 'https://www.isperm.com/en/products/msqa-100/' },
    { '@type': 'SiteNavigationElement', position: 5, name: 'SQA-6100Vet', url: 'https://www.isperm.com/en/products/sqa-6100vet/' },
    { '@type': 'SiteNavigationElement', position: 6, name: 'About Us', url: 'https://www.isperm.com/en/about/' },
    { '@type': 'SiteNavigationElement', position: 7, name: 'Knowledge Hub', url: 'https://www.isperm.com/en/faq/' },
    { '@type': 'SiteNavigationElement', position: 8, name: 'Contact', url: 'https://www.isperm.com/en/contact/' },
  ],
};

const medicalDeviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalDevice',
  name: 'iSperm Medical Semen Analyzer',
  description:
    'Fully automated semen analysis system designed for clinical and animal breeding use, featuring advanced AI algorithms.',
  manufacturer: {
    '@id': 'https://www.isperm.com/#organization',
  },
  applicationCategory: 'MedicalDevice',
  medicalUse: 'Semen analysis and fertility diagnostics',
};

function JsonLd({id, data}: {id: string; data: object}) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}

/** Shared head scripts and JSON-LD for all locale pages. */
export function RootHeadScripts() {
  return (
    <>
      <JsonLd id="json-ld-organization" data={organizationSchema} />
      <JsonLd id="json-ld-website" data={websiteSchema} />
      <JsonLd id="json-ld-navigation" data={navigationSchema} />
      <JsonLd id="json-ld-medical-device" data={medicalDeviceSchema} />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-15TP8Z98ZS"
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-15TP8Z98ZS');
          `}
      </Script>
      <Script id="suppress-extension-errors" strategy="beforeInteractive">
        {`
            (function() {
              const originalError = console.error;
              const originalWarn = console.warn;
              const originalLog = console.log;
              const originalDir = console.dir;
              const originalDirxml = console.dirxml;
              const originalTable = console.table;
              const originalTrace = console.trace;
              const originalGroup = console.group;
              const originalGroupCollapsed = console.groupCollapsed;
              const originalGroupEnd = console.groupEnd;
              const originalTime = console.time;
              const originalTimeEnd = console.timeEnd;
              const originalTimeLog = console.timeLog;
              const originalCount = console.count;
              const originalCountReset = console.countReset;
              const originalAssert = console.assert;
              const originalProfile = console.profile;
              const originalProfileEnd = console.profileEnd;
              const originalClear = console.clear;
              
              function isExtensionError(message) {
                if (!message) return false;
                const msg = String(message).toLowerCase();
                return msg.includes('runtime.lasterror') ||
                       msg.includes('message port closed') ||
                       msg.includes('unchecked runtime.lasterror') ||
                       msg.includes('extension context invalidated') ||
                       msg.includes('receiving end does not exist') ||
                       msg.includes('could not establish connection') ||
                       msg.includes('message port closed before a response');
              }
              
              function createInterceptor(original) {
                return function(...args) {
                  const message = args.map(arg => {
                    if (typeof arg === 'string') return arg;
                    if (arg && typeof arg === 'object') {
                      try { return JSON.stringify(arg); } catch(e) { return String(arg); }
                    }
                    return String(arg);
                  }).join(' ');
                  if (isExtensionError(message)) {
                    return;
                  }
                  return original.apply(console, args);
                };
              }
              
              console.error = createInterceptor(originalError);
              console.warn = createInterceptor(originalWarn);
              console.log = createInterceptor(originalLog);
              if (originalDir) console.dir = createInterceptor(originalDir);
              if (originalDirxml) console.dirxml = createInterceptor(originalDirxml);
              if (originalTable) console.table = createInterceptor(originalTable);
              if (originalTrace) console.trace = createInterceptor(originalTrace);
              if (originalGroup) console.group = createInterceptor(originalGroup);
              if (originalGroupCollapsed) console.groupCollapsed = createInterceptor(originalGroupCollapsed);
              if (originalGroupEnd) console.groupEnd = createInterceptor(originalGroupEnd);
              if (originalTime) console.time = createInterceptor(originalTime);
              if (originalTimeEnd) console.timeEnd = createInterceptor(originalTimeEnd);
              if (originalTimeLog) console.timeLog = createInterceptor(originalTimeLog);
              if (originalCount) console.count = createInterceptor(originalCount);
              if (originalCountReset) console.countReset = createInterceptor(originalCountReset);
              if (originalAssert) console.assert = createInterceptor(originalAssert);
              if (originalProfile) console.profile = createInterceptor(originalProfile);
              if (originalProfileEnd) console.profileEnd = createInterceptor(originalProfileEnd);
              if (originalClear) console.clear = createInterceptor(originalClear);
              
              if (typeof window !== 'undefined') {
                window.addEventListener('unhandledrejection', function(event) {
                  const message = event.reason?.message || String(event.reason || '');
                  if (isExtensionError(message)) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }, true);
                
                window.addEventListener('error', function(event) {
                  const message = event.message || String(event.error || '');
                  if (isExtensionError(message)) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }, true);
              }
            })();
          `}
      </Script>
    </>
  );
}
