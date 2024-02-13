import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';
import { configure } from 'vee-validate';

(() => {
  configure({
    generateMessage: localize({
      zh_TW: zhTW,
    }),
    validateOnInput: true,
  });
  setLocale('zh_TW');
})();
