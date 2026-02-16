import Script from 'next/script';
import {Metadata} from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.isperm.com'),
  title: 'iSperm Semen analyzer - Revolutionizing Semen Analysis',
  description: 'Fully automated semen analysis system designed for clinical and animal breeding use, featuring advanced AI algorithms.',
  // Next.js 13+ 会自动识别 app/icon.svg 作为 favicon，无需手动配置
  alternates: {
    types: {
      'application/atom+xml': [
        {
          url: 'https://www.isperm.com/atom.xml',
          title: 'iSperm Medical RSS Feed',
        },
      ],
    },
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        {/* JSON-LD Structured Data */}
        {/* Organization Schema */}
        <Script
          id="json-ld-organization"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Semen analyzer, CASA - iSperm Medical",
            "url": "https://www.isperm.com",
            "logo": "https://www.isperm.com/iSperm%20LOGO.svg",
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "market@isperm.com",
              "contactType": "Sales"
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "2F, Block B, Shenchengtou & Zhongcheng Life Science Park",
              "addressLocality": "Pingshan District",
              "addressRegion": "Shenzhen",
              "addressCountry": "CN"
            },
            "sameAs": [
              "https://www.isperm.com"
            ]
          })}
        </Script>
        {/* WebSite Schema for Sitelinks */}
        <Script
          id="json-ld-website"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Semen analyzer, CASA - iSperm Medical",
            "url": "https://www.isperm.com",
            "publisher": {
              "@type": "Organization",
              "name": "Semen analyzer, CASA - iSperm Medical",
              "url": "https://www.isperm.com"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://www.isperm.com/{locale}/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </Script>
        {/* SiteNavigationElement Schema for Main Navigation Links */}
        <Script
          id="json-ld-navigation"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "SiteNavigationElement",
                "position": 1,
                "name": "Home",
                "url": "https://www.isperm.com/en/"
              },
              {
                "@type": "SiteNavigationElement",
                "position": 2,
                "name": "Products",
                "url": "https://www.isperm.com/en/products"
              },
              {
                "@type": "SiteNavigationElement",
                "position": 3,
                "name": "Nexus Dx1",
                "url": "https://www.isperm.com/en/products/nexus-dx1"
              },
              {
                "@type": "SiteNavigationElement",
                "position": 4,
                "name": "MSQA-100",
                "url": "https://www.isperm.com/en/products/msqa-100"
              },
              {
                "@type": "SiteNavigationElement",
                "position": 5,
                "name": "SQA-6100Vet",
                "url": "https://www.isperm.com/en/products/sqa-6100vet"
              },
              {
                "@type": "SiteNavigationElement",
                "position": 6,
                "name": "About Us",
                "url": "https://www.isperm.com/en/about"
              },
              {
                "@type": "SiteNavigationElement",
                "position": 7,
                "name": "Knowledge Hub",
                "url": "https://www.isperm.com/en/faq"
              },
              {
                "@type": "SiteNavigationElement",
                "position": 8,
                "name": "Contact",
                "url": "https://www.isperm.com/en/contact"
              }
            ]
          })}
        </Script>
        {/* MedicalDevice Schema */}
        <Script
          id="json-ld-medical-device"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalDevice",
            "name": "iSperm Medical Semen Analyzer",
            "description": "Fully automated semen analysis system designed for clinical and animal breeding use, featuring advanced AI algorithms.",
            "manufacturer": {
              "@type": "Organization",
              "name": "iSperm Medical Ltd.",
              "url": "https://www.isperm.com"
            },
            "applicationCategory": "MedicalDevice",
            "medicalUse": "Semen analysis and fertility diagnostics"
          })}
        </Script>
        {/* Preload banner images for faster LCP - mobile and desktop versions */}
        <link
          rel="preload"
          as="image"
          href="/mobile/banner%20(1).webp"
          media="(max-width: 768px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/banner%20(1).webp"
          media="(min-width: 769px)"
          fetchPriority="high"
        />
        {/* Google tag (gtag.js) */}
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
        {/* Suppress browser extension errors - execute as early as possible */}
        <Script id="suppress-extension-errors" strategy="afterInteractive">
          {`
            (function() {
              // 在最早阶段拦截浏览器扩展错误
              // 保存原始方法（在扩展可能修改之前）
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
              
              // 检查消息是否来自浏览器扩展
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
              
              // 通用的控制台方法拦截器
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
                    return; // 静默忽略扩展错误
                  }
                  return original.apply(console, args);
                };
              }
              
              // 拦截所有控制台方法
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
              
              // 拦截未处理的 Promise 拒绝
              if (typeof window !== 'undefined') {
                window.addEventListener('unhandledrejection', function(event) {
                  const message = event.reason?.message || String(event.reason || '');
                  if (isExtensionError(message)) {
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }, true);
                
                // 拦截全局错误事件
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
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
