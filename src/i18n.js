import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import { get } from "./services/localStorage";

import translationEN from "./locales/en/translation.json";
import translationJP from "./locales/jp/translation.json";
import translationVI from "./locales/vi/translation.json";

import shiftTranslationEN from "./containers/ShiftManagement/translations/translationShiftEN.json";
import shiftTranslationVN from "./containers/ShiftManagement/translations/translationShiftVN.json";
import shiftTranslationJP from "./containers/ShiftManagement/translations/translationShiftJP.json";
import AreaManagementEN from "./locales/en/area_management.json";
import AreaManagementJP from "./locales/jp/area_management.json";
import AreaManagementVI from "./locales/vi/area_management.json";

import TableListEN from "./locales/en/table_list.json";
import TableListJP from "./locales/jp/table_list.json"
import TableListVI from "./locales/vi/table_list.json"

import PaymentEN from "./locales/en/payment_management.json";
import PaymentJP from "./locales/jp/payment_management.json";
import PaymentVI from "./locales/vi/payment_management.json";

import LayoutEN from "./locales/en/layout.json";
import LayoutJP from "./locales/jp/layout.json";
import LayoutVI from "./locales/vi/layout.json";

// the translations
const resources = {
  en: {
    translation: translationEN,
    shiftTranslas: shiftTranslationEN,
    area_management: AreaManagementEN,
    table_list: TableListEN,
    payment: PaymentEN,
    layout: LayoutEN
  },
  vi: {
    translation: translationVI,
    shiftTranslas: shiftTranslationVN,
    area_management: AreaManagementVI,
    table_list: TableListVI,
    payment: PaymentVI,
    layout: LayoutVI
  },
  jp: {
    translation: translationJP,
    shiftTranslas: shiftTranslationJP,
    area_management: AreaManagementJP,
    table_list: TableListJP,
    payment: PaymentJP,
    layout: LayoutJP
  }
};

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: get("lng") || "vi",

    // keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
