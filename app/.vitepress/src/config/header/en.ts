import { markRaw } from 'vue';
import IconOutLink from '~icons/app/icon-out-link.svg';
import { CLA_LINK, DATA_LINK, FORUM_LINK } from '../urls';

const outLink = markRaw(IconOutLink);

const TAG_TYPE = {
  HOT: 'HOT',
  NEW: 'NEW',
};

export default [
  {
    label: 'Download',
    id: 'download',
    children: [
      {
        label: 'Get openGauss',
        children: [
          {
            label: 'openGauss 6.0.6(LTS)',
            description:
              'openGauss 6.0.6 LTS (the latest patch version in the openGauss 6 series) is backed by 3 years of community support and extended maintenance from OGSPs thereafter.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/download/archive/?version=6.0.6%20(LTS)`,
          },
          {
            label: 'openGauss 7.0.0 (LTS)',
            description: 'openGauss 7.0.0 LTS and subsequent LTS versions will follow a 2-year release cycle, offering 3 years of community support with extended maintenance by OGSPs thereafter.',
            tag: TAG_TYPE.NEW,
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/download/?version=lts`,
          },
        ],
      },
      {
        label: 'Related Resources',
        children: [
          {
            label: 'Support Tools',
            description:
              '6 categories of tools for developers and ISVs, including the client tool, data import/export tool, data replication/synchronization tool, monitoring and O&M interfaces and toolset, backup and recovery interfaces and toolset, and data access middleware',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/tools/`,
          },
        ],
      },
    ],
    shortcut: [
      {
        label: 'Historical Releases',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/download/?version=all`,
      },
      {
        label: 'openGauss Lifecycle',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/download/life-cycle/`,
      },
      {
        label: 'openGauss 6.0.1 Installation Guide',
        href: '/en/docs/latest/installation_guide/installation_overview.html',
      },
      {
        label: 'Technical White Papers',
        href: '/en/docs/6.0.0/docs/TechnicalWhitePaper/Technicalwhitepaper.html',
      },
    ],
  },
  {
    label: 'Develop',
    id: 'development',
    children: [
      {
        label: 'Contribute',
        children: [
          {
            label: 'SIG Center',
            description: 'Explore openGauss community SIGs.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/sig/sig-list/`,
            tag: TAG_TYPE.NEW,
          },
          {
            label: 'CLA',
            description: 'Sign the CLA to protect your work—multiple options available!',
            href: `${CLA_LINK}sign/gitee_opengauss-1614047760000855378`,
            icon: outLink,
          },
          {
            label: 'Contribution Guide',
            description: 'See how to get involved and make an impact in our community.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/contribution/`,
          },
        ],
      },
    ],
    shortcut: [
      {
        label: 'Developer Calendar',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/#calendar`,
      },
    ],
  },
  {
    label: 'Document',
    id: 'document',
    children: [
      {
        label: 'Document Center',
        children: [
          {
            label: 'Document Center',
            description: 'Your go-to resource for different usage scenarios.',
            tag: TAG_TYPE.NEW,
            href: '/en/',
            target: '_blank',
          },
          {
            label: 'Quick Start',
            description: 'Learn the community essentials in 10 minutes.',
            href: '/en/docs/latest/getting_started/getting_started.html',
            target: '_blank',
          },
          {
            label: 'Installation Guide',
            description: 'Step-by-step instructions for installing openGauss.',
            href: `/en/docs/latest/installation_guide/installation_overview.html`,
            target: '_blank',
          },
          {
            label: 'Documentation Development Guide',
            description: 'Discover how you can contribute to document development.',
            href: `/en/docs/common/contribute/directory_structure_introductory.html`,
            target: '_blank',
          },
        ],
      },
    ],
    shortcut: [
      {
        label: 'About openGauss',
        href: `/en/docs/latest/about_opengauss/about_opengauss.html`,
        target: '_blank',
      },
      {
        label: 'Database Administration Guide',
        href: `/en/docs/latest/database_administration_guide/database_concepts.html`,
        target: '_blank',
      },
    ],
  },
  {
    label: 'Learn',
    id: 'learn',
    children: [
      {
        label: 'Videos',
        children: [
          {
            label: 'Live',
            description: 'Dive into the minds of those shaping our future.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/video/?id=1`,
          },
          {
            label: 'openGauss Crash Course',
            description: 'Dive into deep learning with our hands-on guide from data to deployment.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/video/?id=2`,
          },
          {
            label: 'Database Basics',
            description: 'Supercharge your workflow with our advanced data processing, caching, and pipeline features.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/video/?id=3`,
          },
          {
            label: 'Offline Activities',
            description: 'Join us for in-person discussions and turn ideas into action.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/video/?id=4`,
          },
        ],
      },
    ],
    shortcut: [
      {
        label: 'Introduction to Databases',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/video/detail/?id=6-6`,
      },
      {
        label: 'Database Basics',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/video/detail/?id=6-5`,
      },
      {
        label: 'SQL Syntax Introduction and Classification',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/video/detail/?id=6-4`,
      },
    ],
  },
  {
    label: 'Support',
    id: 'approve',
    children: [
      {
        label: 'Certification',
        children: [
          {
            label: 'Distribution Certification',
            description: 'Check the certification for your DBV release now.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/certification/`,
          },
          {
            label: 'oGSP Certification',
            description: 'Check your oGSP certification status instantly.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/ogsp/`,
          },
        ],
      },
      {
        label: 'Security',
        children: [
          {
            label: 'Vulnerability Management',
            description: 'Take control of your security.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/vulnerability-management/`,
          },
          {
            label: 'Security Advisories',
            description: 'Stay protected and in the know.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/security-advisories/`,
          },
          {
            label: 'CVEs',
            description: 'Get immediate updates on all openGauss CVEs.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/cve/`,
          },
        ],
      },
      {
        label: 'Zone',
        children: [
          {
            label: 'AI Zone',
            description: 'Explore openGauss AI ecosystem: Agent, RAG, and more',
            tag: 'new',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/ai/agent/`,
          },
        ],
      },
    ],
  },
  {
    label: 'Community',
    id: 'community',
    children: [
      {
        label: 'About',
        children: [
          {
            label: 'Statistics',
            description: 'Find stats and see how the openGauss community thrives.',
            href: `${DATA_LINK}en/overview`,
            icon: outLink,
          },
          {
            label: 'Governance',
            description: 'Members of openEuler committees.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/member/`,
          },
          {
            label: 'Success Stories',
            description: 'Discover how openGauss is transforming business across sectors.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/user-practice/`,
          },
          {
            label: 'Policies & Rules',
            description: 'Learn about the code of conduct and AI contribution policies of the openGauss community.',
            tag: TAG_TYPE.NEW,
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/conduct/`,
          },
        ],
      },
      {
        label: 'Engage with Us',
        children: [
          {
            label: 'Forum',
            description: 'Share knowledge, ask anything, and solve together.',
            href: FORUM_LINK,
            icon: outLink,
          },
          {
            label: 'Mailing Lists',
            description: 'Discuss openGauss tech and progress on our mailing lists.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/online-communication/`,
          },
        ],
      },
    ],
    shortcut: [
      {
        label: 'SIGs',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/member/`,
      },
      {
        label: 'Contribution by Organizations',
        href: `${DATA_LINK}en/detail`,
      },
    ],
  },
  {
    label: 'Stay Updated',
    id: 'update',
    withPicture: true,
    children: [
      {
        label: 'Community Calendar',
        children: [
          {
            label: 'Community Calendar',
            description: 'Stay informed with key events, conferences, and releases.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/events/`,
          },
        ],
      },
      {
        label: 'News & Blogs',
        children: [
          {
            label: 'News',
            description: 'Follow the latest developments, releases, and community updates.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/news/`,
          },
          {
            label: 'Blogs',
            description: 'Gain in-depth knowledge and fresh perspectives on openGauss.',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/en/blogs/`,
          },
        ],
      },
    ],
  },
];
