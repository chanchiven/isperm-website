import {Link} from '@/i18n/routing';
import {
  articleCardStyle,
  articleLinkStyle,
  articleTextWrapperStyle,
  getContentStyle,
  getImageContainerStyle,
  getImageStyle,
  getSubtitleStyle,
  getTitleStyle
} from './faqArticleCardStyles';

interface FAQArticleCardProps {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  locale: string;
  fixedImageHeight?: boolean;
}

export function FAQArticleCard({
  slug,
  title,
  subtitle,
  image,
  alt,
  locale,
  fixedImageHeight = false
}: FAQArticleCardProps) {
  return (
    <article className="article-card" style={articleCardStyle}>
      <Link href={`/faq/${slug}` as any} locale={locale as any} style={articleLinkStyle}>
        <div className="article-image" style={getImageContainerStyle(fixedImageHeight)}>
          <img
            src={image}
            alt={alt}
            style={getImageStyle(fixedImageHeight)}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="article-content" style={getContentStyle(fixedImageHeight)}>
          <div style={articleTextWrapperStyle}>
            <h3 style={getTitleStyle(fixedImageHeight)}>{title}</h3>
            <p style={getSubtitleStyle(fixedImageHeight)}>{subtitle}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
