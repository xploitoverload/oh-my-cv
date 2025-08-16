
// @ts-nocheck
import locale__workspaces_oh_my_cv_site_src_i18n_en_yaml from "../src/i18n/en.yaml";
import locale__workspaces_oh_my_cv_site_src_i18n_sp_yaml from "../src/i18n/sp.yaml";
import locale__workspaces_oh_my_cv_site_src_i18n_zh_cn_yaml from "../src/i18n/zh-cn.yaml";


export const localeCodes =  [
  "en",
  "sp",
  "zh-cn"
]

export const localeLoaders = {
  "en": [{ key: "../src/i18n/en.yaml", load: () => Promise.resolve(locale__workspaces_oh_my_cv_site_src_i18n_en_yaml), cache: true }],
  "sp": [{ key: "../src/i18n/sp.yaml", load: () => Promise.resolve(locale__workspaces_oh_my_cv_site_src_i18n_sp_yaml), cache: true }],
  "zh-cn": [{ key: "../src/i18n/zh-cn.yaml", load: () => Promise.resolve(locale__workspaces_oh_my_cv_site_src_i18n_zh_cn_yaml), cache: true }]
}

export const vueI18nConfigs = [
  () => import("../i18n.config.ts?hash=bffaebcb&config=1" /* webpackChunkName: "i18n_config_bffaebcb" */)
]

export const nuxtI18nOptions = {
  "experimental": {
    "localeDetector": "",
    "switchLocalePathLinkSSR": false,
    "autoImportTranslationFunctions": false
  },
  "bundle": {
    "compositionOnly": true,
    "runtimeOnly": false,
    "fullInstall": true,
    "dropMessageCompiler": false
  },
  "compilation": {
    "jit": true,
    "strictMessage": false,
    "escapeHtml": false
  },
  "customBlocks": {
    "defaultSFCLang": "json",
    "globalSFCScope": false
  },
  "vueI18n": "",
  "locales": [
    {
      "code": "en",
      "name": "English",
      "icon": "i-icon-park-outline:english",
      "files": [
        "i18n/en.yaml"
      ]
    },
    {
      "code": "sp",
      "name": "Spanish",
      "icon": "i-material-symbols:language-spanish",
      "files": [
        "i18n/sp.yaml"
      ]
    },
    {
      "code": "zh-cn",
      "name": "简体中文",
      "icon": "i-icon-park-outline:chinese",
      "files": [
        "i18n/zh-cn.yaml"
      ]
    }
  ],
  "defaultLocale": "en",
  "defaultDirection": "ltr",
  "routesNameSeparator": "___",
  "trailingSlash": false,
  "defaultLocaleRouteNameSuffix": "default",
  "strategy": "prefix_and_default",
  "lazy": false,
  "langDir": "i18n",
  "detectBrowserLanguage": {
    "alwaysRedirect": false,
    "cookieCrossOrigin": false,
    "cookieDomain": null,
    "cookieKey": "i18n_redirected",
    "cookieSecure": false,
    "fallbackLocale": "",
    "redirectOn": "root",
    "useCookie": true
  },
  "differentDomains": false,
  "baseUrl": "",
  "dynamicRouteParams": false,
  "customRoutes": "page",
  "pages": {},
  "skipSettingLocaleOnNavigate": false,
  "types": "composition",
  "debug": false,
  "parallelPlugin": false,
  "i18nModules": []
}

export const normalizedLocales = [
  {
    "code": "en",
    "name": "English",
    "icon": "i-icon-park-outline:english",
    "files": [
      {
        "path": "i18n/en.yaml"
      }
    ]
  },
  {
    "code": "sp",
    "name": "Spanish",
    "icon": "i-material-symbols:language-spanish",
    "files": [
      {
        "path": "i18n/sp.yaml"
      }
    ]
  },
  {
    "code": "zh-cn",
    "name": "简体中文",
    "icon": "i-icon-park-outline:chinese",
    "files": [
      {
        "path": "i18n/zh-cn.yaml"
      }
    ]
  }
]

export const NUXT_I18N_MODULE_ID = "@nuxtjs/i18n"
export const parallelPlugin = false
export const isSSG = false

export const DEFAULT_DYNAMIC_PARAMS_KEY = "nuxtI18n"
export const DEFAULT_COOKIE_KEY = "i18n_redirected"
export const SWITCH_LOCALE_PATH_LINK_IDENTIFIER = "nuxt-i18n-slp"
