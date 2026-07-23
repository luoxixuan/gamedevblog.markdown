---
layout: home

hero:
  name: "游戏开发博客"
  text: "一个游戏客户端开发者的知识库"
  tagline: C++ / Unity / ECS / 渲染 / 工程方法论
  actions:
    - theme: brand
      text: 浏览文章
      link: /blog/#文章导航
    - theme: alt
      text: GitHub
      link: https://github.com/luoxixuan
  # image:
  #   src: /hero.png
  #   alt: hero

features:
  - icon: 🎮
    title: 战斗系统设计
    details: 火焰纹章式战棋公式（2RN命中/攻速AS制/武器相克）、NPC记忆系统、GAS技能架构
    link: /blog/框架设计_002-游戏战斗系统设计
  - icon: ⚡
    title: ECS 架构与性能
    details: 自研 SOA-ECS、5个ComponentStore设计、并行安全两阶段模式、实体承载10K+
    link: /blog/设计模式_001-浅析Unity的ECS模式
  - icon: 🎨
    title: 渲染与表现
    details: HD-2D像素法线光照、程序化地形生成、URP 2D渲染管线
    link: /blog/知识点_007-2D像素法线光照实现
  - icon: 🤖
    title: AI 协作经验
    details: 设计文档先行、AGENTS.md编排、从硬编码到配置驱动的演进
    link: /blog/方法论_003-与AI协作开发的一些经验
  - icon: 🐛
    title: Bug 记录
    details: 网络多线程、iOS输入法、CDN异常、渲染冲突 ... 真实踩坑实录
    link: /blog/bug记录_001-一次网络多线程相关的bug修复
  - icon: 📚
    title: 资料汇总
    details: 游戏开发学习路径、开源项目、GPU Pro源码
    link: /blog/资料汇总_001-游戏开发相关资料汇总

---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);
}

.VPFeature {
  border-radius: 12px;
}

.VPButton.brand {
  border-radius: 8px;
}
</style>
