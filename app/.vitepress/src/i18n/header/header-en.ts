import { markRaw } from 'vue';

import IconOutLink from '~icons/app/icon-out-link.svg';
import odd from '@/assets/category/header/odd.png';
import report from '@/assets/category/header/report.png';

const OutLink = markRaw(IconOutLink);

const TAG_TYPE = {
  HOT: 'HOT',
  NEW: 'NEW',
};

export default {
  NAV_ROUTER: [
    {
      NAME: 'Homepage',
      ID: 'home',
    },
    {
      NAME: 'Download',
      ID: 'download',
      CHILDREN: [
        {
          NAME: 'Get openGauss',
          CHILDREN: [
            {
              NAME: 'openGauss 6.0.2(LTS)',
              DESCRIPTION:
                'An LTS version for openGauss 6.0.0 and later is provided with 3 years of community support, followed by additional maintenance support by oGSPs.',
              TAG: null,
              URL: '/download/?version=lts',
            },
            {
              NAME: 'openGauss 7.0.0-RC1',
              DESCRIPTION: 'RCx: a collaborative testing version released every 6 months, with 6 months of community support.',
              TAG: TAG_TYPE.NEW,
              URL: '/download/?version=rc',
            },
          ],
        },
        {
          NAME: 'Related Resources',
          CHILDREN: [
            {
              NAME: 'Support Tools',
              DESCRIPTION:
                '6 categories of tools for developers and ISVs, including the client tool, data import/export tool, data replication/synchronization tool, monitoring and O&M interfaces and toolset, backup and recovery interfaces and toolset, and data access middleware',
              URL: '/tools/',
            },
          ],
        },
      ],
      SHORTCUT: [
        {
          NAME: 'Historical Releases',
          URL: '/download/?version=all',
        },
        {
          NAME: 'openGauss Lifecycle',
          URL: '/download/life-cycle/',
        },
        {
          NAME: 'openGauss 6.0.1 Installation Guide',
          URL: 'https://docs.opengauss.org/en/docs/6.0.0/docs/GettingStarted/GettingStarted.html',
        },
        {
          NAME: 'Technical White Papers',
          URL: 'https://docs.opengauss.org/en/docs/6.0.0/docs/TechnicalWhitePaper/Technicalwhitepaper.html',
        },
      ],
    },
    {
      NAME: 'Develop',
      ID: 'development',
      CHILDREN: [
        {
          NAME: 'Contribute',
          CHILDREN: [
            {
              NAME: 'CLA',
              DESCRIPTION: 'Sign the CLA to protect your work—multiple options available!',
              URL: 'https://clasign.osinfra.cn/sign/gitee_opengauss-1614047760000855378',
              ICON: OutLink,
            },
            {
              NAME: 'Contribution Guide',
              DESCRIPTION: 'See how to get involved and make an impact in our community.',
              URL: '/contribution/',
            },
          ],
        },
      ],
      SHORTCUT: [
        {
          NAME: 'Developer Calendar',
          URL: '/',
        },
      ],
    },
    {
      NAME: 'Document',
      ID: 'document',
      CHILDREN: [
        {
          NAME: 'Document Center',
          CHILDREN: [
            {
              NAME: 'Document Center',
              DESCRIPTION: 'Your go-to resource for different service scenarios and tool usage.',
              TAG: TAG_TYPE.NEW,
              URL: 'https://docs.opengauss.org/en/',
            },
            {
              NAME: 'Quick Start',
              DESCRIPTION: 'Learn the community essentials in 10 minutes.',
              URL: 'https://docs.opengauss.org/en/docs/latest/docs/GettingStarted/GettingStarted.html',
            },
            {
              NAME: 'Installation Guide',
              DESCRIPTION: 'Step-by-step instructions for installing openGauss.',
              URL: 'https://docs.opengauss.org/en/docs/latest/docs/InstallationGuide/InstallationGuide.html',
            },
            {
              NAME: 'Frequently Asked Questions',
              DESCRIPTION: 'Get answers to common questions and troubleshooting tips.',
              URL: '/faq/',
            },
            {
              NAME: 'Application Development Guide',
              DESCRIPTION: 'Discover how you can contribute to application development.',
              URL: 'https://docs.opengauss.org/en/docs/latest/docs/DeveloperGuide/%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97.html',
            },
          ],
        },
      ],
      SHORTCUT: [
        {
          NAME: 'About openGauss',
          URL: 'https://docs.opengauss.org/en/docs/7.0.0-RC1/docs/TechnicalWhitePaper/%E4%BA%A7%E5%93%81%E5%AE%9A%E4%BD%8D.html',
        },
        {
          NAME: 'DataVec Vector Database',
          URL: 'https://docs.opengauss.org/en/docs/latest/docs/DataVec/DataVec-Overview.html',
        },
        {
          NAME: 'openGauss DataVec + Dify',
          URL: 'https://docs.opengauss.org/en/docs/latest/docs/DataVec/openGauss-Dify.html',
        },
        {
          NAME: 'Database Administration Guide',
          URL: 'https://docs.opengauss.org/en/docs/latest/docs/DatabaseAdministrationGuide/%E6%95%B0%E6%8D%AE%E5%BA%93%E7%AE%A1%E7%90%86%E6%8C%87%E5%8D%97.html',
        },
      ],
    },
    {
      NAME: 'Learn',
      ID: 'learn',
      CHILDREN: [
        {
          NAME: 'Videos',
          CHILDREN: [
            {
              NAME: 'Live',
              DESCRIPTION: 'Dive into the minds of those shaping our future.',
              URL: '/video/?id=1',
            },
            {
              NAME: 'openGauss Crash Course',
              DESCRIPTION: 'Dive into deep learning with our hands-on guide from data to deployment.',
              URL: '/video/?id=2',
            },
            {
              NAME: 'Database Basics',
              DESCRIPTION: 'Supercharge your workflow with our advanced data processing, caching, and pipeline features.',
              URL: '/video/?id=3',
            },
            {
              NAME: 'Offline Activities',
              DESCRIPTION: 'Join us for in-person discussions and turn ideas into action.',
              URL: '/video/?id=4',
            },
          ],
        },
        {
          NAME: 'Growth & Development',
          CHILDREN: [
            {
              NAME: 'Getting Started',
              DESCRIPTION: 'Series of openGauss video tutorials to help you get started.',
              URL: '/quick-start/',
            },
            {
              NAME: 'Advanced Learning',
              DESCRIPTION: 'Master open source software and build the skills that power the future.',
              URL: '/advanced/',
            },
          ],
        },
      ],
      SHORTCUT: [
        {
          NAME: 'Introduction to Databases',
          URL: '/video/detail/?id=6-6',
        },
        {
          NAME: 'Database Basics',
          URL: '/video/detail/?id=6-5',
        },
        {
          NAME: 'SQL Syntax Introduction and Classification',
          URL: '/video/detail/?id=6-4',
        },
      ],
    },
    {
      NAME: 'Support',
      ID: 'approve',
      CHILDREN: [
        {
          NAME: 'Certification',
          CHILDREN: [
            {
              NAME: 'Distribution Certification',
              DESCRIPTION: 'Check the certification for your DBV release now.',
              URL: '/certification/',
            },
            {
              NAME: 'oGSP Certification',
              DESCRIPTION: 'Check your oGSP certification status instantly.',
              URL: '/ogsp/',
            },
          ],
        },
        {
          NAME: 'Compatibility',
          CHILDREN: [
            {
              NAME: 'Compatibility List',
              DESCRIPTION: 'Check software compatibility with openGauss.',
              URL: '/compatibility/',
            },
          ],
        },

        {
          NAME: 'Security',
          CHILDREN: [
            {
              NAME: 'Vulnerability Management',
              DESCRIPTION: 'Take control of your security.',
              URL: '/vulnerability-management/',
            },
            {
              NAME: 'Security Advisories',
              DESCRIPTION: 'Stay protected and in the know.',
              URL: '/security-advisories/',
            },
            {
              NAME: 'CVEs',
              DESCRIPTION: 'Get immediate updates on all openGauss CVEs.',
              URL: '/cve/',
            },
          ],
        },
      ],
    },
    {
      NAME: 'Community',
      ID: 'community',
      CHILDREN: [
        {
          NAME: 'About',
          CHILDREN: [
            {
              NAME: 'Statistics',
              DESCRIPTION: 'Find stats and see how the openGauss community thrives.',
              URL: 'https://datastat.opengauss.org/en/overview',
            },
            {
              NAME: 'Governance',
              DESCRIPTION: 'Members of openEuler committees.',
              URL: '/member/',
            },
            {
              NAME: 'Success Stories',
              DESCRIPTION: 'Discover how openGauss is transforming business across sectors.',
              URL: '/user-practice/',
            },
          ],
        },
        {
          NAME: 'Engage with Us',
          CHILDREN: [
            {
              NAME: 'Forum',
              DESCRIPTION: 'Share knowledge, ask anything, and solve together.',
              URL: 'https://discuss.opengauss.org/',
            },
            {
              NAME: 'Mailing Lists',
              DESCRIPTION: 'Discuss openGauss tech and progress on our mailing lists.',
              URL: '/online-communication/',
            },
          ],
        },
      ],
      SHORTCUT: [
        {
          NAME: 'SIGs',
          URL: '/member/',
        },
        {
          NAME: 'Contribution by Organizations',
          URL: 'https://datastat.opengauss.org/en/detail',
        },
      ],
    },
    {
      NAME: 'Stay Updated',
      ID: 'update',
      WITH_PICTURE: true,
      CHILDREN: [
        {
          NAME: 'Community Calendar',
          CHILDREN: [
            {
              NAME: 'Community Calendar',
              DESCRIPTION: 'Stay informed with key events, conferences, and releases.',
              URL: '/events/',
            },
          ],
        },
        {
          NAME: 'News & Blogs',
          CHILDREN: [
            {
              NAME: 'News',
              DESCRIPTION: 'Follow the latest developments, releases, and community updates.',
              URL: '/news/',
            },
            {
              NAME: 'Blogs',
              DESCRIPTION: 'Gain in-depth knowledge and fresh perspectives on openGauss.',
              URL: '/blogs/',
            },
          ],
        },
      ],
      SHORTCUT: [
        {
          NAME: 'openGauss Developer Day 2025',
          PICTURE: odd,
          DESCRIPTION: '',
          REMARK: 'June 02, 2025 | Beijing',
          TYPE: 'PICTURE',
          URL: '/summit/devday2025/',
        },
        {
          NAME: 'Innovate Databases. Power Intelligence.',
          PICTURE: report,
          DESCRIPTION: '',
          REMARK: 'December 27, 2024 | Beijing',
          TYPE: 'PICTURE',
          URL: '/summit/devday2024/',
        },
      ],
    },
  ],
  MORE: 'More',
  QUICKLINK: 'Quick Links',
  CODE: 'Code',
  SEARCH: {
    BROWSEHISTORY: 'History',
    CLEAN: 'Clean up',
    TOPSEARCH: 'Top search',
    CHANGE: 'Change',
    PLEACHOLDER: 'Please enter the content',
    PLEACHOLDER_EXTEND: 'Please enter the content',
    TEXT: 'Search',
  },
  SOURCE_CODE: [
    {
      NAME: 'GitCode',
      PATH: 'https://gitcode.com/opengauss',
      ICON: OutLink,
    },

    {
      NAME: 'Github',
      PATH: 'https://github.com/opengauss-mirror',
      ICON: OutLink,
    },
  ],
};
