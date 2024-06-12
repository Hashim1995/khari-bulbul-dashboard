import { theme, ThemeConfig } from 'antd';
import logo from '@/assets/images/brand-logo.svg';
import rightSideImg from '@/assets/images/Library-rafiki.svg';
import { CSSProperties } from 'react';

const { defaultAlgorithm, darkAlgorithm } = theme;

export const getThemeConfig = (darkMode: any) => {
  const themeConfig: ThemeConfig = {
    token: {
      paddingXL: 28,
      paddingLG: 20,
      paddingMD: 16,
      paddingSM: 10,
      paddingXS: 6,
      paddingXXS: 2,
      fontSizeXL: 17,
      fontSizeLG: 14,
      fontSizeSM: 10,
      colorBorder: '#e6e1e1',
      colorPrimary: '#008080',
      boxShadow:
        '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      colorLink: '#000'
    },
    components: {
      Layout: {
        colorBgHeader: darkMode ? '#141414' : '',
        colorBgTrigger: darkMode ? '#141414' : '',
        colorBgBody: darkMode ? '#202020' : '#f5f5f5'
      },

      Form: {
        marginLG: 8
      },
      Tabs: {
        horizontalMargin: ' 0 0 10px 0'
      },
      Menu: {
        iconSize: 17,
        popupBg: 'red',
        itemColor: darkMode ? '#fff' : '',
        itemSelectedColor: '#fff',
        itemHoverBg: '#008080',
        itemHoverColor: '#fff',
        itemSelectedBg: '#008080',
        motionDurationFast: '0s',
        motionDurationSlow: '0s',
        controlItemBgActiveHover: 'red'
      },
      Modal: {
        wireframe: true
      }
      // Button: {
      //   colorPrimaryHover: '#0a4b79'
      // }
    },
    algorithm: darkMode ? darkAlgorithm : defaultAlgorithm
  };

  return themeConfig;
};

export const mainLogo: {
  src: string;
  style: CSSProperties;
} = { src: logo, style: { width: '100%', height: '100%' } };

export const rightSideImage: {
  src: string;
  style: CSSProperties;
} = { src: rightSideImg, style: { width: '100%' } };

window.document.title = 'Khari Bülbül';
