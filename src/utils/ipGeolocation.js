import { useSettingStore } from '@/store/setting'

export async function runIPGeolocation() {
  const settingStore = useSettingStore()

  if (settingStore.locale !== null) {
    console.log('skipping IP Geolocation API call.')
    return Promise.resolve(); 
  }

  const countryLangMap = {
    TW: 'zh-tw',
    CN: 'zh-cn',
  }
  const defaultCountryLang = countryLangMap['TW']
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 800)

  try {
        const response = await fetch(`https://ipinfo.io/json?token=${import.meta.env.VITE_IPINFO_TOKEN}`, {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const countryCode = data.country;
        settingStore.locale = countryLangMap[countryCode] || defaultCountryLang;
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            console.error('IP Geolocation API request timeout.');
        } else {
            console.error('IP Geolocation API request error:', error.message);
        }
        settingStore.locale = defaultCountryLang;
    }
}