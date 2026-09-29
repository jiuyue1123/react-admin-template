/**
 * Puck 编辑器界面的中文文案
 *
 * Puck 0.23 **没有 i18n API，但有一份内置的字符串字典**：
 * `getMessage(dictionary, key)` 先查传入的字典、查不到再回落到内置英文。
 * `<Puck dictionary={...} />` 就是这个字典的注入入口（`PuckProps.dictionary`）。
 *
 * 这里的 key **必须与 Puck 的 `defaultDictionary` 逐字对应**（见
 * `@puckeditor/core/dist/chunk-K2LNXU54.mjs`）。缺失的 key 会自动回落到英文，
 * 所以少翻一条只是不生效、不会崩；但写错 key 会静默回落，等于白写。
 *
 * ⚠️ 带 `{占位符}` 的条目必须原样保留占位符 —— Puck 用
 * `template.replace(/\{(\w+)\}/g, ...)` 做插值。
 *
 * 升级 `@puckeditor/core` 后应复查一次 key 是否仍然存在（Puck 未把 key 导出为
 * 类型，所以编译器帮不上忙）。当前覆盖 **65 条，即 Puck 0.23 的全部条目**。
 */
export const PUCK_ZH: Record<string, string> = {
  // ── 顶栏 ──
  "header-publish": "发布",
  "header-undo": "撤销",
  "header-redo": "重做",
  "header-toggle-leftsidebar": "切换左侧栏",
  "header-toggle-rightsidebar": "切换右侧栏",
  "header-toggle-menubar": "切换菜单栏",

  // ── 组件操作 ──
  "action-selectparent": "选中父级",
  "action-duplicate": "复制",
  "action-delete": "删除",

  // ── 兜底标签（面包屑 / 字段面板 / 顶栏共用）──
  "label-page": "页面",
  "label-component": "组件",

  // ── 大纲（图层树）──
  "outline-empty": "暂无内容",
  "outline-item-collapse": "折叠",
  "outline-item-expand": "展开",
  "outline-header-title": "大纲",
  "outline-header-collapseall": "全部折叠",
  "outline-item-duplicate": "复制",
  "outline-item-delete": "删除",

  // ── 组件抽屉 ──
  "drawer-category-collapse": "折叠 {title}",
  "drawer-category-expand": "展开 {title}",
  "drawer-category-other": "其他",

  // ── 画布 ──
  "canvas-noconfig": "{type} 没有可配置项",

  // ── 字段 ──
  "field-readonly": "只读",
  "field-arrayitem-summary": "第 {index} 项",
  "field-arrayitem-duplicate": "复制",
  "field-arrayitem-delete": "删除",
  "field-external-selectdata": "选择数据",
  "field-external-search": "搜索",
  "field-external-togglefilters": "显示/隐藏筛选",
  "field-external-item": "外部数据项",
  "field-external-result-singular": "{count} 条结果",
  "field-external-result-plural": "{count} 条结果",

  // ── 富文本工具栏 ──
  "field-richtext-bold": "加粗",
  "field-richtext-italic": "斜体",
  "field-richtext-underline": "下划线",
  "field-richtext-strikethrough": "删除线",
  "field-richtext-blockquote": "引用",
  "field-richtext-code-inline": "行内代码",
  "field-richtext-code-block": "代码块",
  "field-richtext-list-bullet": "无序列表",
  "field-richtext-list-ordered": "有序列表",
  "field-richtext-horizontalrule": "分隔线",
  "field-richtext-align-left": "左对齐",
  "field-richtext-align-center": "居中",
  "field-richtext-align-right": "右对齐",
  "field-richtext-align-justify": "两端对齐",
  "field-richtext-select": "选择",
  "field-richtext-headingselect-1": "标题 1",
  "field-richtext-headingselect-2": "标题 2",
  "field-richtext-headingselect-3": "标题 3",
  "field-richtext-headingselect-4": "标题 4",
  "field-richtext-headingselect-5": "标题 5",
  "field-richtext-headingselect-6": "标题 6",
  "field-richtext-alignselect-left": "左",
  "field-richtext-alignselect-center": "中",
  "field-richtext-alignselect-right": "右",
  "field-richtext-alignselect-justify": "两端",
  "field-richtext-listselect-bullet": "无序列表",
  "field-richtext-listselect-ordered": "有序列表",

  // ── 视口 ──
  "viewport-zoom-in": "放大",
  "viewport-zoom-out": "缩小",
  "viewport-zoom-auto": "{zoom}%（自适应）",
  "viewport-toggle-menu": "切换视口菜单",
  "viewport-switch": "切换到 {label} 视口",
  "viewport-switch-default": "切换视口",

  // ── 侧栏插件页签 ──
  "plugin-blocks": "区块",
  "plugin-outline": "大纲",
  "plugin-fields": "字段",
  "plugin-components": "组件",

  // ── 其它 ──
  "layout-maximize": "最大化",
  "layout-minimize": "最小化",
  "loader-loading": "加载中",
}
