import type { CSSProperties, ReactNode } from 'react'
import { BlockStyles, toSiteThemeVars } from '@jff/builder-blocks'

/**
 * 站点主题作用域 —— 让编辑器/预览里的区块与访客端线上同貌
 *
 * 区块是同文档渲染在 admin 页面里的，若不管，它们会继承 admin 文档的字体、
 * 行高、文字色，而线上是访客端 `<body>` 显式钉住的字体栈 + 16px/1.6。
 *
 * 两侧的修法是同一个：把 `--jff-*` 站点主题变量铺在作用域元素上，靠**继承**
 * 生效（访客端铺在 `<body>`，这里铺在作用域元素）。用内联自定义属性而不是
 * `<style>` 标签：作用域天然限定在这棵子树里，也不依赖样式表在 head 中的先后。
 *
 * `<BlockStyles />` 必须无条件挂载 —— 这张表原先只在 Button / Form 渲染时才
 * 出现，一个只放了 ServicesGrid 的页面根本没有它。React 按 `href` 全文档去重，
 * 所以这里再渲染一次不会产生重复样式。
 */
const SITE_THEME_VARS = toSiteThemeVars() as CSSProperties

export default function SiteThemeScope({
  children,
  className,
  contents = false,
}: {
  children: ReactNode
  /** 原容器的类名（高度等），会与 `jff-site` 合并。`contents` 模式下无意义 */
  className?: string
  /**
   * 用 `display: contents` 包住内容：**不生成盒子**，只往下传自定义属性与
   * 可继承的排版属性。包 Puck 画布时必须用它 —— 画布内部有靠父元素高度
   * 取 `height: 100%` 的容器，插入一个真实盒子会改变它的包含块。
   */
  contents?: boolean
}) {
  if (contents) {
    return (
      <div className="jff-site" style={{ ...SITE_THEME_VARS, display: 'contents' }}>
        <BlockStyles />
        {children}
      </div>
    )
  }

  return (
    <div className={className ? `jff-site ${className}` : 'jff-site'} style={SITE_THEME_VARS}>
      <BlockStyles />
      {children}
    </div>
  )
}
