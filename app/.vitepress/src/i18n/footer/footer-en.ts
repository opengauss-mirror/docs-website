import { EULER_LINK, MINDSPORE_LINK,  KUNPENG_LINK, BBSCSDN_LINK, OPENUBMC_URL, OPENFUYAO_URL, DATA_LINK, DOCS_LINK, FORUM_LINK } from '@/config/urls';

export default {
  FOOTER_NAVS: [
    {
      NAME: 'About openGauss',
      LINKS: [
        {
          NAME: 'Organization',
          URL: '/en/member/',
        },
        {
          NAME: 'Statistics',
          URL: `${DATA_LINK}/en/overview`,
        },
      ],
    },
    {
      NAME: 'News & Blogs',
      LINKS: [
        {
          NAME: 'News',
          URL: '/en/news/',
        },
        {
          NAME: 'Blog',
          URL: '/en/blogs/',
        },
        {
          NAME: 'White Papers',
          URL: `${DOCS_LINK}/en/docs/6.0.0/docs/TechnicalWhitePaper/Technicalwhitepaper.html`,
        },
      ],
    },
    {
      NAME: 'Access',
      LINKS: [
        {
          NAME: 'Get openGauss',
          URL: '/en/download/',
        },
        {
          NAME: 'Support Tools',
          URL: '/en/tools/',
        },
        {
          NAME: 'All versions',
          URL: '/en/download/?version=all',
        },
      ],
    },
    {
      NAME: 'Services & Resources',
      LINKS: [
        {
          NAME: 'Document Center',
          URL: `${DOCS_LINK}/en/`,
        },
        {
          NAME: 'Frequently Asked Questions',
          URL: '/en/faq/',
        },
        {
          NAME: 'Security Advisories',
          URL: '/en/security-advisories/',
        },
      ],
    },
    {
      NAME: 'Communicate',
      LINKS: [
        {
          NAME: 'Mailing Lists',
          URL: '/en/online-communication/',
        },
        {
          NAME: 'Events',
          URL: '/en/events/',
        },
        {
          NAME: 'Forum',
          URL: FORUM_LINK,
        },
      ],
    },
    {
      NAME: 'Contribute',
      LINKS: [
        {
          NAME: 'Contribution Guide',
          URL: '/en/contribution/',
        },
        {
          NAME: 'Videos',
          URL: '/en/video/',
        },
      ],
    },
  ],
  FRIENDLY_LINKS: [
    {
      NAME: 'openEuler',
      URL: EULER_LINK,
    },
    {
      NAME: 'MindSpore',
      URL: MINDSPORE_LINK,
    },
    {
      NAME: 'openUBMC',
      URL: OPENUBMC_URL,
    },
    {
      NAME: 'openFuyao',
      URL: OPENFUYAO_URL,
    },
    {
      NAME: 'Kunpeng',
      URL: `${KUNPENG_LINK}en/`,
    },
    {
      NAME: 'Gauss 松鼠会',
      URL: `${BBSCSDN_LINK}forums/gaussdb`,
    },
  ],
  OPTIONS: [
    {
      NAME: `Trademark`,
      URL: `/en/brand/`,
      TARGET: `_blank`,
    },
    {
      NAME: `Privacy Statement`,
      URL: `/en/privacy/`,
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
      URL: `/en/about-us/`,
      TARGET: `_blank`,
    },
  ],
  COPY_RIGHT: `Copyright © openGauss {year}. All rights reserved.`,
  OFFICIAL_ACCOUNT: 'openGauss公众号',
  LINK_TITLE: 'Related Links',
};
