import slash from 'slash2';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import themePluginConfig from './themePluginConfig';
import proxy from './proxy';
import webpackPlugin from './plugin.config';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION, REACT_APP_ENV } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  ['umi-plugin-antd-icon-config', {}],
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: false,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [

            {path: '/', redirect: '/expenses/ExpensesIndex' },

            {
              path: '/expenses',
              name: '支出管理',
              icon: 'money-collect',
              routes: [
                {
                  path: '/expenses/ExpensesIndex',
                  name: '支出展示',
                  icon: 'swap-left',
                  component: './friday/expenses/ExpensesIndex',
                },
                {
                  path: '/expenses/ExpensesTable',
                  name: '支出详情',
                  icon: 'table',
                  component: './friday/expenses/ExpensesTable',
                },
              ],
            },

            {
              path: '/income',
              name: '收入管理',
              icon: 'dollar-circle',
              routes: [
                {
                  path: '/income/IncomeIndex',
                  name: '收入展示',
                  icon: 'swap-right',
                  component: './friday/income/IncomeIndex',
                },
                {
                  path: '/income/IncomeTable',
                  name: '收入详情',
                  icon: 'table',
                  component: './friday/income/IncomeTable',
                },
              ],
            },

            {
              path: '/stockMarket',
              name: '股市',
              icon: 'line-chart',
              routes: [
                {
                  path: '/stockMarket/StockMarketRank',
                  name: '股市排行',
                  icon: 'ordered-list',
                  component: './friday/stockMarket/StockMarketRank',
                },
                {
                  path: '/stockMarket/StockMarketDetail',
                  name: '股票详情',
                  icon: 'account-book',
                  component: './friday/stockMarket/StockMarketDetail',
                },
                {
                  path: '/stockMarket/StockMarketSort',
                  name: '行业板块',
                  icon: 'appstore',
                  component: './friday/stockMarket/StockMarketSort',
                },
                {
                  path: '/stockMarket/StockMarketTable',
                  name: '我的股票',
                  icon: 'transaction',
                  component: './friday/stockMarket/StockMarketTable',
                },




              ],
            },

            {
              path: '/fund',
              name: '基金',
              icon: 'fund',
              routes: [
                {
                  path: '/fund/FundRank',
                  name: '基金排行',
                  icon: 'sort-descending',
                  component: './friday/fund/FundRank',
                },
                {
                  path: '/fund/FundDetail',
                  name: '基金详情',
                  icon: 'highlight',
                  component: './friday/fund/FundDetail',
                },

                {
                  path: '/fund/MyFundTable',
                  name: '我的基金',
                  icon: 'interaction',
                  component: './friday/fund/MyFundTable',
                },
              ],
            },

            {
              path: '/assets',
              name: '我的资产',
              icon: 'car',
              routes: [
                {
                  path: '/assets/AssetsIndex',
                  name: '我的资产',
                  icon: 'property-safety',
                  component: './friday/assets/AssetsIndex',
                },
                {
                  path: '/assets/AssetsTable',
                  name: '资产详情',
                  icon: 'reconciliation',
                  component: './friday/Assets/AssetsTable',
                },
              ],
            },

            {
              path: '/claimsAndDebts',
              name: '债务债权',
              icon: 'red-envelope',
              routes: [
                {
                  path: '/claimsAndDebts/ClaimsAndDebtsIndex',
                  name: '分类展示',
                  icon: 'cluster',
                  component: './friday/claimsAndDebts/ClaimsAndDebtsIndex',
                },
                {
                  path: '/claimsAndDebts/ClaimsAndDebtsTable',
                  name: '债权债务详情',
                  icon: 'credit-card',
                  component: './friday/claimsAndDebts/ClaimsAndDebtsTable',
                },
              ],
            },

            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  proxy: {
    '/api/': {
      target: 'http://localhost:10010',
      changeOrigin: true,
      pathRewrite: { '^/api/': '' },
    },
  },

  chainWebpack: webpackPlugin,
};

