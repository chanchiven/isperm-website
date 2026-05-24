import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Metadata} from 'next';
import {Link} from '@/i18n/routing';
import {Navigation} from '@/components/Navigation';
import {Footer} from '@/components/Footer';
import {FAQArticleCard} from '@/components/FAQArticleCard';
import {generateHreflangAlternates} from '@/i18n/hreflang';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  try {
    if (!params) {
      return {
        title: 'Knowledge Hub | iSperm Medical',
        description: 'Comprehensive CASA system FAQs and guides.',
      };
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale) {
      return {
        title: 'Knowledge Hub | iSperm Medical',
        description: 'Comprehensive CASA system FAQs and guides.',
      };
    }
    const {locale} = resolvedParams;
    const t = await getTranslations({locale, namespace: 'faq'});

    return {
      title: t('meta.title'),
      description: t('meta.description'),
      alternates: generateHreflangAlternates('/faq', locale),
    };
  } catch (error) {
    console.error('Error in faq generateMetadata:', error);
    return {
      title: 'Knowledge Hub | iSperm Medical',
      description: 'Comprehensive CASA system FAQs and guides.',
    };
  }
}

export default async function FAQPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  try {
    if (!params) {
      throw new Error('Params is undefined in FAQPage');
    }
    const resolvedParams = await params;
    if (!resolvedParams || !resolvedParams.locale) {
      throw new Error('Resolved params is invalid in FAQPage');
    }
    const {locale} = resolvedParams;
    setRequestLocale(locale);
    const t = await getTranslations({locale, namespace: 'faq'});
  // Get English translations for fallback
  const tEn = await getTranslations({locale: 'en', namespace: 'faq'});

  // Helper function to get translation with fallback to English
  const getT = (key: string) => {
    let value = t(key, {default: null});
    
    // Check if value is invalid (null, key path, or equals the key itself)
    const isInvalid = !value || 
                      (typeof value === 'string' && (
                        value.startsWith('articles.') || 
                        value === key ||
                        value === `faq.${key}` ||
                        value.startsWith('faq.articles.')
                      ));
    
    if (isInvalid) {
      // Fallback to English
      value = tEn(key, {default: null});
      // If English value is also invalid, return empty string to avoid displaying key paths
      if (!value || (typeof value === 'string' && (
        value.startsWith('articles.') || 
        value === key || 
        value === `faq.${key}` ||
        value.startsWith('faq.articles.')
      ))) {
        return '';
      }
    }
    return value || '';
  };

  // Article slugs for list page (using new unified structure)
  const articleSlugs = {
    spermmaxxing: 'article-what-is-spermmaxxing-2026',
    spermBiomarker: 'article-sperm-health-biomarker-2026',
    fertilityCrisis: 'article-male-fertility-crisis-2026',
    humanSemen: 'faq-human-semen-standards',
    who6th: 'who-6th-edition-semen-analysis-standards',
    iso23162: 'iso-23162-2021-laboratory-competence-guide',
    eshre: 'eshre-guidelines-clinical-semen-examination',
    asrm: 'asrm-male-infertility-evaluation-protocols',
    bull: 'faq-bull-breeding-soundness',
    canine: 'faq-canine-semen-analysis',
    poultry: 'faq-poultry-semen-analysis',
    stallion: 'faq-stallion-semen-analysis',
    camelid: 'faq-camelid-andrology',
    fish: 'faq-fish-semen-analysis',
    ram: 'faq-ram-breeding-soundness',
    boar: 'faq-boar-semen-evaluation'
  };

  return (
    <div>
      {/* Navigation */}
      <Navigation />

      {/* Knowledge Hub Header */}
      <section className="hero" style={{minHeight: '60vh', position: 'relative'}}>
        <div className="hero-background" style={{
          backgroundImage: `url('/banner%20(3).webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2
        }}></div>
        <div className="hero-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 100%)',
          zIndex: -1
        }}></div>
        <div className="container" style={{position: 'relative', zIndex: 1}}>
          <div className="hero-content">
            <h1 className="hero-title">{t('hero.title')}</h1>
            <p className="hero-subtitle">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="about-section" style={{padding: '80px 0'}}>
        <div className="container">
          {/* Article Section */}
          <div className="section-header" id="article">
            <h2>{getT('sections.article.title')}</h2>
          </div>
          <div className="articles-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 350px))',
            gap: '2rem',
            marginBottom: '4rem',
            justifyContent: 'start',
            alignItems: 'stretch',
            alignContent: 'start'
          }}>
            <FAQArticleCard
              slug={articleSlugs.spermmaxxing}
              title={getT(`articles.${articleSlugs.spermmaxxing}.title`)}
              subtitle={getT(`articles.${articleSlugs.spermmaxxing}.subtitle`)}
              image={getT(`articles.${articleSlugs.spermmaxxing}.image`)}
              alt={getT(`articles.${articleSlugs.spermmaxxing}.alt`)}
              fixedImageHeight={true}
              locale={locale}
            />
            <FAQArticleCard
              slug={articleSlugs.spermBiomarker}
              title={getT(`articles.${articleSlugs.spermBiomarker}.title`)}
              subtitle={getT(`articles.${articleSlugs.spermBiomarker}.subtitle`)}
              image={getT(`articles.${articleSlugs.spermBiomarker}.image`)}
              alt={getT(`articles.${articleSlugs.spermBiomarker}.alt`)}
              fixedImageHeight={true}
              locale={locale}
            />
            <FAQArticleCard
              slug={articleSlugs.fertilityCrisis}
              title={getT(`articles.${articleSlugs.fertilityCrisis}.title`)}
              subtitle={getT(`articles.${articleSlugs.fertilityCrisis}.subtitle`)}
              image={getT(`articles.${articleSlugs.fertilityCrisis}.image`)}
              alt={getT(`articles.${articleSlugs.fertilityCrisis}.alt`)}
              fixedImageHeight={true}
              locale={locale}
            />
          </div>

          {/* Human Andrology Section */}
          <div className="section-header" id="human">
            <h2>{t('sections.human.title')}</h2>
          </div>
          <div className="articles-grid" style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 350px))', 
            gap: '2rem', 
            marginBottom: '4rem', 
            justifyContent: 'start',
            alignItems: 'stretch',
            alignContent: 'start'
          }}>
            <FAQArticleCard
              slug={articleSlugs.humanSemen}
              title={getT(`articles.${articleSlugs.humanSemen}.title`)}
              subtitle={getT(`articles.${articleSlugs.humanSemen}.subtitle`)}
              image={getT(`articles.${articleSlugs.humanSemen}.image`)}
              alt={getT(`articles.${articleSlugs.humanSemen}.alt`)}
              fixedImageHeight={true}
              locale={locale}
            />
            <FAQArticleCard
              slug={articleSlugs.who6th}
              title={getT(`articles.${articleSlugs.who6th}.title`)}
              subtitle={getT(`articles.${articleSlugs.who6th}.subtitle`)}
              image={getT(`articles.${articleSlugs.who6th}.image`)}
              alt={getT(`articles.${articleSlugs.who6th}.alt`)}
              fixedImageHeight={true}
              locale={locale}
            />
            <FAQArticleCard
              slug={articleSlugs.iso23162}
              title={getT(`articles.${articleSlugs.iso23162}.title`)}
              subtitle={getT(`articles.${articleSlugs.iso23162}.subtitle`)}
              image={getT(`articles.${articleSlugs.iso23162}.image`)}
              alt={getT(`articles.${articleSlugs.iso23162}.alt`)}
              fixedImageHeight={true}
              locale={locale}
            />
            <FAQArticleCard
              slug={articleSlugs.eshre}
              title={getT(`articles.${articleSlugs.eshre}.title`)}
              subtitle={getT(`articles.${articleSlugs.eshre}.subtitle`)}
              image={getT(`articles.${articleSlugs.eshre}.image`)}
              alt={getT(`articles.${articleSlugs.eshre}.alt`)}
              fixedImageHeight={true}
              locale={locale}
            />
            <FAQArticleCard
              slug={articleSlugs.asrm}
              title={getT(`articles.${articleSlugs.asrm}.title`)}
              subtitle={getT(`articles.${articleSlugs.asrm}.subtitle`)}
              image={getT(`articles.${articleSlugs.asrm}.image`)}
              alt={getT(`articles.${articleSlugs.asrm}.alt`)}
              fixedImageHeight={true}
              locale={locale}
            />
          </div>

          {/* Veterinary Andrology Section */}
          <div className="section-header" id="veterinary">
            <h2>{t('sections.veterinary.title')}</h2>
          </div>
          <div className="articles-grid" style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            alignItems: 'stretch'
          }}>
            <FAQArticleCard
              slug={articleSlugs.bull}
              title={getT(`articles.${articleSlugs.bull}.title`)}
              subtitle={getT(`articles.${articleSlugs.bull}.subtitle`)}
              image={getT(`articles.${articleSlugs.bull}.image`)}
              alt={getT(`articles.${articleSlugs.bull}.alt`)}
              fixedImageHeight={false}
              locale={locale}
            />
            <FAQArticleCard
              slug={articleSlugs.canine}
              title={getT(`articles.${articleSlugs.canine}.title`)}
              subtitle={getT(`articles.${articleSlugs.canine}.subtitle`)}
              image={getT(`articles.${articleSlugs.canine}.image`)}
              alt={getT(`articles.${articleSlugs.canine}.alt`)}
              fixedImageHeight={false}
              locale={locale}
            />
            <FAQArticleCard
              slug={articleSlugs.poultry}
              title={getT(`articles.${articleSlugs.poultry}.title`)}
              subtitle={getT(`articles.${articleSlugs.poultry}.subtitle`)}
              image={getT(`articles.${articleSlugs.poultry}.image`)}
              alt={getT(`articles.${articleSlugs.poultry}.alt`)}
              fixedImageHeight={false}
              locale={locale}
            />
            <FAQArticleCard
              slug={articleSlugs.stallion}
              title={getT(`articles.${articleSlugs.stallion}.title`)}
              subtitle={getT(`articles.${articleSlugs.stallion}.subtitle`)}
              image={getT(`articles.${articleSlugs.stallion}.image`)}
              alt={getT(`articles.${articleSlugs.stallion}.alt`)}
              fixedImageHeight={false}
              locale={locale}
            />
            <FAQArticleCard
              slug={articleSlugs.camelid}
              title={getT(`articles.${articleSlugs.camelid}.title`)}
              subtitle={getT(`articles.${articleSlugs.camelid}.subtitle`)}
              image={getT(`articles.${articleSlugs.camelid}.image`)}
              alt={getT(`articles.${articleSlugs.camelid}.alt`)}
              fixedImageHeight={false}
              locale={locale}
            />
            <FAQArticleCard
              slug={articleSlugs.fish}
              title={getT(`articles.${articleSlugs.fish}.title`)}
              subtitle={getT(`articles.${articleSlugs.fish}.subtitle`)}
              image={getT(`articles.${articleSlugs.fish}.image`)}
              alt={getT(`articles.${articleSlugs.fish}.alt`)}
              fixedImageHeight={false}
              locale={locale}
            />
            <FAQArticleCard
              slug={articleSlugs.ram}
              title={getT(`articles.${articleSlugs.ram}.title`)}
              subtitle={getT(`articles.${articleSlugs.ram}.subtitle`)}
              image={getT(`articles.${articleSlugs.ram}.image`)}
              alt={getT(`articles.${articleSlugs.ram}.alt`)}
              fixedImageHeight={false}
              locale={locale}
            />
            <FAQArticleCard
              slug={articleSlugs.boar}
              title={getT(`articles.${articleSlugs.boar}.title`)}
              subtitle={getT(`articles.${articleSlugs.boar}.subtitle`)}
              image={getT(`articles.${articleSlugs.boar}.image`)}
              alt={getT(`articles.${articleSlugs.boar}.alt`)}
              fixedImageHeight={false}
              locale={locale}
            />
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </div>
  );
  } catch (error) {
    console.error('Error in FAQPage:', error);
    // 返回一个基本的错误页面
    return (
      <div>
        <p>Error loading page. Please try again later.</p>
      </div>
    );
  }
}

