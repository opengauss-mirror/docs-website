import zh from './zh';
import en from './en';
import IconOutLink from '~icons/app/icon-out-link.svg';
import { markRaw } from 'vue';
import { ATOMGIT_LINK, GITHUB_LINK } from '../urls';

const outLink = markRaw(IconOutLink);

export default {
  nav: { zh, en },
  sourceCode: [
    {
      href: `${ATOMGIT_LINK}/opengauss`,
      icon: outLink,
      label: 'AtomGit',
    },
    {
      href: `${GITHUB_LINK}/opengauss-mirror`,
      icon: outLink,
      label: 'GitHub',
    },
  ],
  langOptions: [
    { id: 'zh', label: '简体中文', simple: '中' },
    { id: 'en', label: 'English', simple: 'EN' },
  ],
  userOptions: {
    zh: [
      {
        id: 'center',
        label: '个人中心',
        target: '_blank',
        url: `${import.meta.env.VITE_LOGIN_URL}/zh/profile`
      },
      {
        id: 'message',
        label: '消息中心',
        target: '_self',
        url: '/zh/notifications/'
      },
      {
        id: 'logout',
        label: '退出登录',
        logout: true,
        target: '',
        url: ''
      },
    ],
    en: [
      {
        id: 'center',
        label: 'User Center',
        target: '_blank',
        url: `${import.meta.env.VITE_LOGIN_URL}/en/profile`
      },
      {
        id: 'message',
        label: 'Notifications',
        target: '_self',
        url: '/en/notifications/'
      },
      {
        id: 'logout',
        label: 'Logout',
        logout: true,
        target: '',
        url: ''
      },
    ]
  }
};
