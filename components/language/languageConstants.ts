export const ALL_LANGUAGES = [
  {code: 'en', name: 'English'},
  {code: 'ar', name: 'العربية'},
  {code: 'bg', name: 'Български'},
  {code: 'de', name: 'Deutsch'},
  {code: 'es', name: 'Español'},
  {code: 'fr', name: 'Français'},
  {code: 'id', name: 'Bahasa Indonesia'},
  {code: 'it', name: 'Italiano'},
  {code: 'ja', name: '日本語'},
  {code: 'ko', name: '한국어'},
  {code: 'nl', name: 'Nederlands'},
  {code: 'pl', name: 'Polski'},
  {code: 'pt', name: 'Português'},
  {code: 'ro', name: 'Română'},
  {code: 'ru', name: 'Русский'},
  {code: 'tr', name: 'Türkçe'},
  {code: 'uk', name: 'Українська'},
  {code: 'vi', name: 'Tiếng Việt'}
] as const;

export type LanguageOption = (typeof ALL_LANGUAGES)[number];

export function getLanguageName(code: string): string {
  return ALL_LANGUAGES.find((lang) => lang.code === code)?.name ?? 'English';
}

export function buildLocaleSwitchUrl(currentPath: string, newLocale: string, locales: readonly string[]): string {
  const pathSegments = currentPath.split('/').filter(Boolean);
  if (pathSegments.length > 0 && locales.includes(pathSegments[0])) {
    pathSegments.shift();
  }
  const remainingPath = pathSegments.length > 0 ? `/${pathSegments.join('/')}` : '';
  return `/${newLocale}${remainingPath}`;
}
