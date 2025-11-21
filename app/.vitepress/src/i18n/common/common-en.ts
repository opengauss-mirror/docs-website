import { GAUSS_EMAIL } from '@/config/urls';

export default {
  USER_CENTER: `User Center`,
  LOGOUT: `Logout`,
  FOOTER: {
    MAIL: GAUSS_EMAIL,
    COPY_RIGHT: `Copyright © openGauss {year}. All rights reserved.`,
    RIGHT_LIST: [
      {
        NAME: `Trademark`,
        URL: `/en/brand/`,
        TARGET: `_blank`,
      },
      {
        NAME: `Privacy Policy`,
        URL: `/en/privacyPolicy/`,
        TARGET: `_blank`,
      },
      {
        NAME: `Legal Notice`,
        URL: `/en/legal/`,
        TARGET: `_blank`,
      },
      {
        NAME: `About Cookies`,
        URL: `/en/cookies/`,
        TARGET: `_blank`,
      },
      {
        NAME: `About Us`,
        URL: `/en/aboutUs/`,
        TARGET: `_blank`,
      },
    ],
    QR_CODE: `WeChat Subscription`,
  },

  docCenter: 'Document Center',
  returnHome: 'Back to Homepage',
  empty: 'No data available',
};
