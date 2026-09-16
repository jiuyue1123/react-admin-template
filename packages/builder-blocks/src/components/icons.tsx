import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Inline SVG icon set
//
// Why not a UI-kit icon package (e.g. @ant-design/icons):
//   Its icons are `'use client'` components that call `createContext` at module
//   scope. Blocks are rendered on the visitor site's server (React Server
//   Components), where `createContext` is unavailable — importing them fails
//   the build outright, and even if it didn't, the icons could never appear in
//   the server-rendered HTML.
//
// Keeping the glyphs inline also drops a UI-kit dependency from every visitor
// page's bundle.
//
// Geometry: 24×24 viewBox, stroke-based, `1em` square so a block's existing
// `fontSize` styling keeps controlling the icon size (drop-in for font icons).
// ---------------------------------------------------------------------------

const PATHS: Record<string, ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  delete: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="m19 6-1 14H6L5 6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  check: <path d="m20 6-11 11-5-5" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  upload: (
    <>
      <path d="M12 21V9" />
      <path d="m7 13 5-5 5 5" />
      <path d="M5 3h14" />
    </>
  ),
  setting: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5 14 5l3-.4.6 3 2.4 1.8-1.5 2.6 1.5 2.6L17.6 16l-.6 3-3-.4-2 2.5-2-2.5-3 .4-.6-3L3.5 14l1.5-2.6L3.5 8.8 5.9 7l.6-3 3 .4Z" />
    </>
  ),
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V21h13V9.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  phone: (
    <path d="M21.5 16.9v2.8a2 2 0 0 1-2.2 2 19.6 19.6 0 0 1-8.5-3 19.3 19.3 0 0 1-6-6 19.6 19.6 0 0 1-3-8.6 2 2 0 0 1 2-2.2h2.8a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.1-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  heart: <path d="M12 20.5 4.7 13a4.6 4.6 0 0 1 6.5-6.5l.8.9.8-.9A4.6 4.6 0 0 1 19.3 13Z" />,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9Z" />,
  "arrow-left": (
    <>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  "arrow-up": (
    <>
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </>
  ),
  "arrow-down": (
    <>
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </>
  ),
  link: (
    <>
      <path d="M10.5 13.5a4.5 4.5 0 0 0 6.4.5l2.6-2.6a4.5 4.5 0 0 0-6.4-6.4l-1.5 1.5" />
      <path d="M13.5 10.5a4.5 4.5 0 0 0-6.4-.5l-2.6 2.6a4.5 4.5 0 0 0 6.4 6.4l1.5-1.5" />
    </>
  ),
  reload: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
      <path d="M20.5 4v5h-5" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <path d="m8.3 13.2 7.4 4M15.7 6.8l-7.4 4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 16.5v-5M12 8h.01" />
    </>
  ),
  warning: (
    <>
      <path d="M10.3 4 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9.5v4M12 17h.01" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.6 9.6a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.4" />
      <path d="M12 17h.01" />
    </>
  ),
  cart: (
    <>
      <circle cx="9.5" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3.5H5l2.3 12.1a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.2L20.5 7H5.4" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  unlock: (
    <>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 7.5-1.9" />
    </>
  ),
  send: (
    <>
      <path d="M21.5 2.5 2.5 10.8l8 3.2 3.2 8Z" />
      <path d="m21.5 2.5-11 11" />
    </>
  ),
  filter: <path d="M3.5 5h17l-6.8 7.6V19l-3.4 1.8v-8.2Z" />,
  swap: (
    <>
      <path d="M4 7.5h13" />
      <path d="m14 4.5 3 3-3 3" />
      <path d="M20 16.5H7" />
      <path d="m10 13.5-3 3 3 3" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 2.5c3.3 2.6 5 6.2 5 10.3L12 17.5l-5-4.7c0-4.1 1.7-7.7 5-10.3Z" />
      <circle cx="12" cy="9" r="1.7" />
      <path d="m8.3 16.4-2 3.1M15.7 16.4l2 3.1" />
    </>
  ),
  bulb: (
    <>
      <path d="M12 2.8a6 6 0 0 0-3.4 11v2.4h6.8V13.8A6 6 0 0 0 12 2.8Z" />
      <path d="M9.5 19.2h5M10.5 21.5h3" />
    </>
  ),
  aim: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.6" />
    </>
  ),
  safety: (
    <>
      <path d="M12 2.8 5 5.8v6.3c0 4.4 2.9 7.9 7 8.9 4.1-1 7-4.5 7-8.9V5.8Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  team: (
    <>
      <circle cx="9" cy="8" r="3.4" />
      <path d="M2.8 20a6.2 6.2 0 0 1 12.4 0" />
      <path d="M16 5.4a3.4 3.4 0 0 1 0 6.5" />
      <path d="M17.6 14.4A6.2 6.2 0 0 1 21.2 20" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="8" width="17" height="3.8" rx="1" />
      <path d="M5.5 11.8V21h13v-9.2" />
      <path d="M12 8v13" />
      <path d="M12 8S10.6 3 8 3a2.5 2.5 0 0 0 0 5Z" />
      <path d="M12 8s1.4-5 4-5a2.5 2.5 0 0 1 0 5Z" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 3.5h8v5.5a4 4 0 0 1-8 0Z" />
      <path d="M8 5.5H5V7a3 3 0 0 0 3 3M16 5.5h3V7a3 3 0 0 1-3 3" />
      <path d="M12 13v4" />
      <path d="M9.5 20.5h5" />
      <path d="M10.5 17h3l.6 3.5h-4.2Z" />
    </>
  ),
  chart: (
    <>
      <path d="M3 20.5h18" />
      <path d="M6.5 20.5v-6M11.5 20.5V7M16.5 20.5v-9" />
    </>
  ),
};

/** 全部图标 key（顺序即编辑器下拉里的展示顺序） */
export const ICON_KEYS: string[] = Object.keys(PATHS);

/** 是否为已知图标 */
export function hasIcon(name: string): boolean {
  return name in PATHS;
}

/**
 * 图标字形
 *
 * 尺寸取 `1em`，因此外层用 `fontSize` 控制大小、用 `color` 控制颜色 ——
 * 与原先字体图标的行为完全一致，各区块无需改动样式。
 */
export function IconGlyph({ name }: { name: string }) {
  const glyph = PATHS[name];
  if (!glyph) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "-0.125em", flexShrink: 0 }}
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}
