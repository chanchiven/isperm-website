import Script from 'next/script';
import {Metadata} from 'next';

export const metadata: Metadata = {
  icons: {
    icon: {
      url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🧬</text></svg>',
      type: 'image/svg+xml',
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
        {/* Banner image preload removed - CSS backgroundImage cannot effectively utilize preload */}
        {/* The banner image is loaded via CSS backgroundImage, which browsers cannot immediately recognize as using the preloaded resource */}
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
            const originalWarn = console.warn;
            
            console.error = function(...args) {
              const message = args.join(' ');
              if (message.includes('runtime.lastError') || 
                  message.includes('message port closed') ||
                  message.includes('Unchecked runtime.lastError')) {
                return; // Suppress extension-related errors
              }
              originalError.apply(console, args);
            };
            
            console.warn = function(...args) {
              const message = args.join(' ');
              if (message.includes('runtime.lastError') || 
                  message.includes('message port closed') ||
                  message.includes('Unchecked runtime.lastError')) {
                return; // Suppress extension-related warnings
              }
              originalWarn.apply(console, args);
            };
            
            // Handle unhandled promise rejections from extensions
            window.addEventListener('unhandledrejection', function(event) {
              const message = event.reason?.message || String(event.reason || '');
              if (message.includes('runtime.lastError') || 
                  message.includes('message port closed')) {
                event.preventDefault(); // Suppress extension-related promise rejections
              }
            });
            
            // Suppress extension errors in error event listeners
            window.addEventListener('error', function(event) {
              const message = event.message || String(event.error || '');
              if (message.includes('runtime.lastError') || 
                  message.includes('message port closed')) {
                event.preventDefault();
                return false;
              }
            }, true);
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
