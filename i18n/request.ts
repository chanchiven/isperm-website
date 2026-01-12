import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  try {
    // 安全地获取 locale，处理 requestLocale 可能为 undefined 的情况
    let locale: string = routing.defaultLocale;
    try {
      if (requestLocale) {
        const resolvedLocale = await requestLocale;
        if (resolvedLocale) {
          locale = resolvedLocale;
        }
      }
    } catch (e) {
      // 如果出错，使用默认语言
      locale = routing.defaultLocale;
    }

    // 确保 locale 是合法的，否则回退到默认语言
    if (!locale || !routing.locales.includes(locale as any)) {
      locale = routing.defaultLocale;
    }

    // 定义需要加载的翻译文件列表（排除备份和临时文件）
    const translationFiles = ['index', 'about', 'contact', 'faq', 'products', 'search'];
    
    // 加载所有翻译文件作为命名空间
    const messages: Record<string, any> = {};
    
    for (const fileName of translationFiles) {
      try {
        // 尝试加载当前语言的翻译文件
        const fileMessages = await import(`../messages/${locale}/${fileName}.json`);
        messages[fileName] = fileMessages.default || fileMessages;
      } catch (error: any) {
        // 如果当前语言的文件不存在，尝试加载英文版本作为后备
        if (locale !== routing.defaultLocale) {
          try {
            const fallbackMessages = await import(`../messages/${routing.defaultLocale}/${fileName}.json`);
            messages[fileName] = fallbackMessages.default || fallbackMessages;
          } catch (fallbackError) {
            // 如果英文版本也加载失败，记录警告但继续
            console.warn(`Failed to load translation file ${fileName} for locale ${locale} and fallback:`, error?.message || error);
            // 设置空对象以避免后续错误
            messages[fileName] = {};
          }
        } else {
          // 如果是英文也加载失败，记录错误但继续
          console.warn(`Failed to load translation file ${fileName} for locale ${locale}:`, error?.message || error);
          // 设置空对象以避免后续错误
          messages[fileName] = {};
        }
      }
    }

    // 确保至少返回一个有效的对象结构
    if (Object.keys(messages).length === 0) {
      console.error(`No messages loaded for locale ${locale}. Returning empty messages object.`);
      // 返回空对象而不是抛出错误
      return {
        locale,
        messages: {}
      };
    }

    return {
      locale,
      messages
    };
  } catch (error: any) {
    // 捕获所有未预期的错误，确保不会导致 500
    console.error('Critical error in getRequestConfig:', error?.message || error);
    // 返回默认配置，确保应用可以继续运行
    return {
      locale: routing.defaultLocale,
      messages: {}
    };
  }
});
