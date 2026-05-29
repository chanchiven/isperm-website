import {Metadata} from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.isperm.com'),
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
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
