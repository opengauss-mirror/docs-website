import { markRaw } from 'vue';
import odd from '@/assets/category/header/odd.png';
import report from '@/assets/category/header/report.png';
import IconOutLink from '~icons/app/icon-out-link.svg';
import { ATOMGIT_LINK, CLA_LINK, DATA_LINK, FORUM_LINK } from '../urls';

const outLink = markRaw(IconOutLink);

export default [
  {
    id: 'download',
    label: '下载',
    children: [
      {
        label: '获取openGauss',
        children: [
          {
            label: 'openGauss 6.0.6 (LTS)',
            description: 'openGauss 6.0.6 LTS 作为openGauss 6系列最新补丁版本，社区提供3年支持，社区OGSP伙伴提供三年以后维护支持服务',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/download/archive/?version=6.0.6%20(LTS)`,
          },
          {
            label: 'openGauss 7.0.0 (LTS)',
            description: 'openGauss 7.0.0 LTS及后续LTS版本发布间隔周期为2年，社区提供3年支持，社区OGSP伙伴提供3年以后维护支持服务。',
            tag: 'new',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/download/?version=lts`,
          },
        ],
      },
      {
        label: '获取其他资源',
        children: [
          {
            label: '工具中心',
            description:
              '主要面向开发者和ISV，提供六大类开发工具、客户端工具、数据导入导出工具、数据复制/同步工具、监控运维接口及工具集、备份恢复接口及工具集、通用数据框架。',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/tools/`,
          },
        ],
      },
    ],
    shortcut: [
      {
        label: '查询全部版本',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/download/?version=all`,
      },
      {
        label: '版本生命周期',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/download/life-cycle/`,
      },
      {
        label: 'openGauss 6.0.1版本安装指南',
        href: '/zh/docs/6.0.0/docs/InstallationGuide/InstallationGuide.html',
      },
      {
        label: '技术白皮书',
        href: '/zh/docs/6.0.0/docs/TechnicalWhitePaper/Technicalwhitepaper.html',
      },
    ],
  },
  {
    label: '开发',
    id: 'development',
    children: [
      {
        label: '贡献',
        children: [
          {
            label: 'SIG中心',
            description: '了解openGauss社区贡献者的角色及其职责。',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/sig/sig-list/`,
            tag: 'new',
          },
          {
            label: 'CLA签署',
            description: '参与贡献前，需签署贡献者许可协议（CLA）',
            href: `${CLA_LINK}sign/gitee_opengauss-1614047760000855378`,
            icon: outLink,
          },
          {
            label: '贡献攻略',
            description: '参与社区贡献的方式',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/contribution/`,
          },
        ],
      },
    ],
    shortcut: [
      {
        label: '开发者日历',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/#calendar`,
      },
    ],
  },
  {
    label: '文档',
    id: 'document',
    children: [
      {
        label: '文档中心',
        children: [
          {
            label: '文档中心',
            description: '提供各使用场景所需的用户手册',
            tag: 'new',
            href: '/zh/',
          },
          {
            label: '新手入门',
            description: '10分钟玩转社区，快速构建与成长',
            href: '/zh/docs/latest/getting_started/understanding_opengauss.html',
          },
          {
            label: '安装指南',
            description: '指导用户完成 openGauss 数据库安装',
            href: '/zh/docs/latest/installation_guide/installation_overview.html',
          },
          {
            label: '常见问题',
            description: '常见问题解决方法',
            href: '/zh/docs/common/faq/faq.html',
          },
          {
            label: '文档开发指南',
            description: '参与文档开发的方式',
            href: '/zh/docs/common/contribute/contribution_process.html',
          },
        ],
      },
    ],
    shortcut: [
      {
        label: '关于openGauss',
        href: '/zh/docs/latest/about_opengauss/about_opengauss.html',
      },
      {
        label: 'DataVec向量数据库',
        href: '/zh/docs/latest/datavec/datavec_overview.html',
      },
      {
        label: 'openGauss DataVec + Dify，快速搭建你的智能助手平台',
        href: '/zh/docs/latest/datavec/opengauss_dify.html',
      },
      {
        label: '数据库管理指南',
        href: '/zh/docs/latest/database_administration_guide/database_concepts.html',
      },
    ],
  },
  {
    label: '学习',
    id: 'learn',
    children: [
      {
        label: '视频',
        children: [
          {
            label: '专题直播',
            description: '众多大咖精彩课程直播',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/video/?id=1`,
          },
          {
            label: '轻松上手',
            description: '贯穿openGauss深度学习的基本流程，包括数据处理、模型加载与保存、图模式加速等实践案例',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/video/?id=2`,
          },
          {
            label: '数据库基础',
            description: '提供数据处理相关增强、缓存、pipeline等功能案例',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/video/?id=3`,
          },
          {
            label: '线下活动',
            description: '参与线下交流、学习讨论',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/video/?id=4`,
          },
        ],
      },
      {
        label: '开发者成长',
        children: [
          {
            label: '快速体验',
            description: 'openGauss官方出品的迷你视频课程',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/quick-start/`,
          },
          {
            label: '学习进阶',
            description: '开源基础软件学习培训',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/advanced/`,
          },
          {
            label: '大咖之声',
            description: '了解 openGauss 专家演讲',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/bigshot-voice/`,
          },
          {
            label: '培训认证',
            description: '欢迎学习HCIA-openGauss华为认证openGauss工程师在线课程',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/training/`,
          },
          {
            label: '开源实习',
            description: '帮助在校学生在项目实践中提升能力，成为优秀的开源人才',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/internship/`,
          },
        ],
      },
    ],
    shortcut: [
      {
        label: '数据库介绍',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/video/detail/?id=6-6`,
      },
      {
        label: '数据库基础知识',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/video/detail/?id=6-5`,
      },
      {
        label: 'SQL语法入门、分类',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/video/detail/?id=6-4`,
      },
      {
        label: 'openGauss联众创新：打造面向企业核心业务开源数据库',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/bigshot-voice/`,
      },
    ],
  },
  {
    label: '支持',
    id: 'approve',
    children: [
      {
        label: '认证',
        children: [
          {
            label: '发行版认证',
            description: '查看DBV发行版认证结果',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/certification/`,
          },
          {
            label: '服务商认证',
            description: '查看oGSP服务商认证流程与结果',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/ogsp/`,
          },
        ],
      },
      {
        label: '兼容性专区',
        children: [
          {
            label: '兼容性列表',
            description: '查看openGauss兼容性列表',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/compatibility/`,
          },
          {
            label: '兼容性技术测评',
            description: '帮助企业快速申请兼容性测评',
            jumpOut: true,
            href: `${ATOMGIT_LINK}opengauss/compatible-certification`,
            icon: outLink,
          },
        ],
      },
      {
        label: '迁移',
        children: [
          {
            label: '迁移专区',
            description: '了解openGauss迁移方案，获取迁移技术支持',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/migration/`,
          },
        ],
      },
      {
        label: '安全中心',
        children: [
          {
            label: '漏洞管理',
            description: 'openGauss漏洞管理与处理流程',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/vulnerability-management/`,
          },
          {
            label: '安全公告',
            description: 'openGauss安全公告',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/security-advisories/`,
          },
          {
            label: 'CVE',
            description: 'openGauss CVE公告',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/cve/`,
          },
        ],
      },
      {
        label: '专区',
        children: [
          {
            label: 'AI专区',
            description: '了解 openGauss 在 Agent、RAG 等 AI 场景的技术生态和适配情况',
            tag: 'new',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/ai/agent/`,
          },
          {
            label: 'oGMemory 专区',
            description: '面向AI Agent的长期记忆系统，以AGFS文件为数据源头，openGauss向量索引为加速层，让Agent拥有跨会话的持久记忆能力。',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/ogmemory/`,
          }
        ],
      },
    ],
    shortcut: [
      {
        label: '迁移实践案例',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/migration/case/index.html#migration-evaluate`,
      },
      {
        label: '前往迁移互动专区',
        href: `${ATOMGIT_LINK}opengauss/openGauss-workbench`,
        icon: outLink,
      },
      {
        label: 'MySQL迁移',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/migration/`,
      },
    ],
  },
  {
    label: '社区',
    id: 'community',
    children: [
      {
        label: '关于社区',
        children: [
          {
            label: '贡献看板',
            description: '查看openGauss社区数据',
            href: `${DATA_LINK}zh/overview`,
            icon: outLink,
          },
          {
            label: '社区荣誉',
            description: '了解openGauss的荣誉奖项',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/honor/`,
          },
          {
            label: '社区组织',
            description: '了解openGauss的委员会成员',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/member/`,
          },
          {
            label: '用户案例',
            description: '了解openGauss在各行业的最佳案例',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/user-practice/`,
          },
          {
            label: '金融专区',
            description: '基于openGauss的金融解决方案',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/finance/`,
          },
          {
            label: '政策规则',
            description: '了解openGauss社区的行为准则、AI贡献策略等相关内容',
            tag: 'new',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/conduct/`,
          },
        ],
      },
      {
        label: '社区交流',
        children: [
          {
            label: '社区论坛',
            description: '参与开发者讨论openGauss',
            href: FORUM_LINK,
            icon: outLink,
          },
          {
            label: '邮件列表',
            description: '订阅邮件列表，与SIG成员讨论openGauss的技术与进展',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/online-communication/`,
          },
        ],
      },
    ],
    shortcut: [
      {
        label: '专项兴趣小组（SIG）',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/member/`,
      },
      {
        label: 'openGauss 社区突出贡献单位',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/honor/`,
      },
      {
        label: '单位会员贡献',
        href: `${DATA_LINK}zh/detail`,
        icon: outLink,
      },
    ],
  },
  {
    label: '动态',
    id: 'update',
    withPicture: true,
    children: [
      {
        label: '活动',
        children: [
          {
            label: '活动',
            description: '了解openGauss社区全年活动',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/events/`,
          },
          {
            label: '峰会',
            description: '查看openGauss年度大会详情',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/summit/summit2025/`,
          },
          {
            label: '结队计划',
            description: '获取社区结队技术支持',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/team-up/`,
          },
          {
            label: 'Call for Meetup',
            description: '开发者活动共创',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/call-for-meetup/`,
          },
        ],
      },
      {
        label: '资讯',
        children: [
          {
            label: '新闻',
            description: '查看openGauss社区动态',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/news/`,
          },
          {
            label: '博客',
            description: '查看openGauss技术文章分享',
            href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/blogs/`,
          },
        ],
      },
    ],
    shortcut: [
      {
        label: 'openGauss Summit 2025',
        picture: odd,
        description: '',
        remark: '时间：2025/12/26 | 北京',
        type: 'PICTURE',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/summit/summit2025/`,
      },
      {
        label: '汇聚数据库创新力量，引领智能时代新未来',
        picture: report,
        description: '',
        remark: '时间：2024/12/27 | 北京',
        type: 'PICTURE',
        href: `${import.meta.env.VITE_MAIN_DOMAIN_URL}/zh/summit/summit2024/`,
      },
    ],
  },
];
