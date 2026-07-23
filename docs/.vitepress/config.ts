import { defineConfig } from 'vitepress'

// 分类侧边栏（文件名中的 # 已替换为 -）
const sidebarByCategory = [
  {
    text: '📖 入门基础',
    collapsed: false,
    items: [
      { text: 'C++11', link: '/blog/知识点_001-C++11' },
      { text: 'C++的多线程', link: '/blog/知识点_001-C++的多线程' },
      { text: 'C++杂七杂八小知识', link: '/blog/知识点_001-C++的一些杂七杂八小知识' },
      { text: '程序员都该知道存储器', link: '/blog/知识点_002-程序员都该知道存储器' },
      { text: '3D数学基础', link: '/blog/知识点_005-3D数学基础' },
      { text: '手游纹理格式详解', link: '/blog/知识点_004-手游纹理格式详解' },
    ]
  },
  {
    text: '🔵 网络与同步',
    collapsed: true,
    items: [
      { text: 'TCP与UDP在游戏中的应用', link: '/blog/知识点_003-TCP与UDP在游戏中的应用' },
      { text: 'MMO的战斗同步框架', link: '/blog/框架设计_001-MMO的战斗同步框架' },
    ]
  },
  {
    text: '🟡 战斗系统设计',
    collapsed: true,
    items: [
      { text: '游戏战斗系统设计', link: '/blog/框架设计_002-游戏战斗系统设计' },
      { text: 'NPC记忆系统设计', link: '/blog/框架设计_003-NPC记忆系统设计' },
      { text: 'GAS技能系统实现', link: '/blog/框架设计_004-GAS技能系统实现' },
    ]
  },
  {
    text: '🟣 ECS架构与性能',
    collapsed: true,
    items: [
      { text: '浅析Unity的ECS模式', link: '/blog/设计模式_001-浅析Unity的ECS模式' },
      { text: 'ECS并行安全的工程实践', link: '/blog/知识点_006-ECS并行安全的工程实践' },
    ]
  },
  {
    text: '🟠 渲染与表现',
    collapsed: true,
    items: [
      { text: '2D像素法线光照实现', link: '/blog/知识点_007-2D像素法线光照实现' },
      { text: 'Lua相关：C++与Lua交互', link: '/blog/Lua相关_001-C++与Lua交互' },
    ]
  },
  {
    text: '🔴 Bug记录',
    collapsed: true,
    items: [
      { text: '网络多线程bug修复', link: '/blog/bug记录_001-一次网络多线程相关的bug修复' },
      { text: 'iOS13输入法问题', link: '/blog/bug记录_002-iOS13输入法问题' },
      { text: 'CDN资源异常', link: '/blog/bug记录_003-一次更新下载cdn资源异常问题' },
      { text: 'macOS 12.4问题', link: '/blog/bug记录_004-macos升级12.4遇到的问题' },
      { text: 'Tilemap+Spine渲染bug', link: '/blog/bug记录_005-cocos的tilemap和spine同时使用遇到的渲染bug' },
    ]
  },
  {
    text: '⚪ 方法论与工程',
    collapsed: true,
    items: [
      { text: '工作中提高沟通效率的技巧', link: '/blog/方法论_001-工作中提高沟通效率的技巧' },
      { text: '解决问题的一些方法', link: '/blog/方法论_002-解决问题的一些方法' },
      { text: '与AI协作开发的一些经验', link: '/blog/方法论_003-与AI协作开发的一些经验' },
    ]
  },
  {
    text: '📦 资料汇总',
    collapsed: true,
    items: [
      { text: '游戏开发相关资料汇总', link: '/blog/资料汇总_001-游戏开发相关资料汇总' },
      { text: '游戏相关源代码汇总', link: '/blog/资料汇总_002-游戏相关源代码汇总' },
    ]
  },
]

export default defineConfig({
  base: '/gamedevblog.markdown/',
  lang: 'zh-CN',
  title: '游戏开发博客',
  description: '一个游戏客户端开发者的个人知识库',

  // 忽略死链检查（有些文章间的交叉引用还未全部更新）
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '文章列表', link: '/blog/-文章导航' },
      { text: '关于', link: '/about' },
    ],

    sidebar: {
      '/blog/': [
        { text: '📑 全部文章', link: '/blog/-文章导航' },
        ...sidebarByCategory,
      ]
    },

    outline: { level: [2, 3] },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索' },
          modal: { noResultsText: '没有找到相关结果', resetButtonTitle: '清除', footer: { closeText: '关闭' } }
        }
      }
    },

    darkModeSwitchLabel: '外观',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/luoxixuan' }
    ],

    footer: {
      message: '基于 <a href="https://vitepress.dev">VitePress</a> 构建',
      copyright: 'CC BY-NC-SA 4.0'
    },

    editLink: {
      pattern: 'https://github.com/luoxixuan/gamedevblog.markdown/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页'
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    lastUpdated: {
      text: '最后更新',
      formatOptions: { dateStyle: 'short' }
    }
  },

  markdown: {
    math: true,
    lineNumbers: true,
  },

  lastUpdated: true,
})
