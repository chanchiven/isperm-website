import Script from 'next/script';

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        {/* Preload critical banner image for LCP optimization */}
        <link rel="preload" as="image" href="/banner (1).webp" />
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
        {/* Suppress browser extension errors */}
        <Script id="suppress-extension-errors" strategy="afterInteractive">
          {`
            // Suppress "runtime.lastError" messages from browser extensions
            const originalError = console.error;
            console.error = function(...args) {
              const message = args.join(' ');
              if (message.includes('runtime.lastError') || 
                  message.includes('message port closed')) {
                return; // Suppress extension-related errors
              }
              originalError.apply(console, args);
            };
            
            // Handle unhandled promise rejections from extensions
            window.addEventListener('unhandledrejection', function(event) {
              const message = event.reason?.message || String(event.reason || '');
              if (message.includes('runtime.lastError') || 
                  message.includes('message port closed')) {
                event.preventDefault(); // Suppress extension-related promise rejections
              }
            });
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
