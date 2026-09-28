'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { isMenuActive, resolveMenuHref } from '@/lib/menu'
import type { PublicSiteMenu } from '@/lib/types'
import { MenuLink, hasOwnHref } from './MenuLink'

/**
 * 站点导航
 *
 * 仅这一小块是客户端组件（需要当前路径判断激活态、以及移动端开合）。
 * 站点壳其余部分保持服务端渲染，保证首屏 HTML 直出。
 */

const ITEM_BASE =
  'inline-flex min-h-11 items-center rounded-lg px-3 text-[15px] transition-colors duration-150'

function itemClass(active: boolean): string {
  return `${ITEM_BASE} ${active ? 'font-medium text-brand' : 'text-muted hover:text-ink'}`
}

function ChevronDown() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="ml-1 h-3 w-3 opacity-60 transition-transform duration-200 group-hover:rotate-180"
    >
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  )
}

export default function NavMenu({ items }: { items: PublicSiteMenu[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // 路由变化后收起移动端面板
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Esc 关闭
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (items.length === 0) return null

  return (
    <>
      {/* 桌面端：横向导航，含子项的父级 hover / 键盘聚焦时展开下拉 */}
      <nav aria-label="站点导航" className="ml-auto hidden items-center gap-0.5 md:flex">
        {items.map((menu, i) => {
          const children = menu.children ?? []
          if (children.length === 0) {
            const href = resolveMenuHref(menu)
            return (
              <MenuLink
                key={`${menu.menuName}-${i}`}
                menu={menu}
                className={itemClass(isMenuActive(pathname, href))}
              />
            )
          }
          return (
            <div key={`${menu.menuName}-${i}`} className="group relative">
              {hasOwnHref(menu) ? (
                <MenuLink
                  menu={menu}
                  className={`${itemClass(isMenuActive(pathname, resolveMenuHref(menu)))} group-hover:text-ink`}
                >
                  <span className="inline-flex items-center">
                    {menu.menuName}
                    <ChevronDown />
                  </span>
                </MenuLink>
              ) : (
                <button type="button" className={itemClass(false)} aria-haspopup="true">
                  <span className="inline-flex items-center">
                    {menu.menuName}
                    <ChevronDown />
                  </span>
                </button>
              )}
              <div className="invisible absolute left-0 top-full z-20 w-52 translate-y-1 rounded-xl border border-line bg-surface p-1.5 opacity-0 shadow-lg shadow-black/5 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {children.map((child, j) => {
                  const href = resolveMenuHref(child)
                  return (
                    <MenuLink
                      key={`${child.menuName}-${j}`}
                      menu={child}
                      className={`flex min-h-10 items-center rounded-lg px-3 text-[14px] transition-colors ${
                        isMenuActive(pathname, href) ? 'bg-canvas font-medium text-brand' : 'text-muted hover:bg-canvas hover:text-ink'
                      }`}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* 移动端：汉堡按钮 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="site-mobile-nav"
        aria-label={open ? '关闭菜单' : '打开菜单'}
        className="-mr-2 ml-auto inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink transition-colors hover:bg-canvas md:hidden"
      >
        <Hamburger open={open} />
      </button>

      {/* 移动端：展开面板 */}
      {open && (
        <div
          id="site-mobile-nav"
          className="absolute inset-x-0 top-full z-20 max-h-[calc(100vh-var(--jf-header-h))] overflow-y-auto border-b border-line bg-surface px-4 pb-4 shadow-lg shadow-black/5 md:hidden"
        >
          <nav aria-label="站点导航" className="flex flex-col py-1">
            {items.map((menu, i) => {
              const children = menu.children ?? []
              return (
                <div key={`${menu.menuName}-${i}`} className="border-b border-line/60 last:border-b-0">
                  {hasOwnHref(menu) || children.length === 0 ? (
                    <MenuLink
                      menu={menu}
                      className={`flex min-h-12 items-center text-[16px] ${
                        isMenuActive(pathname, resolveMenuHref(menu)) ? 'font-medium text-brand' : 'text-ink'
                      }`}
                    />
                  ) : (
                    <span className="flex min-h-12 items-center text-[16px] text-ink">{menu.menuName}</span>
                  )}
                  {children.length > 0 && (
                    <div className="flex flex-col pb-2 pl-4">
                      {children.map((child, j) => (
                        <MenuLink
                          key={`${child.menuName}-${j}`}
                          menu={child}
                          className={`flex min-h-11 items-center text-[15px] ${
                            isMenuActive(pathname, resolveMenuHref(child)) ? 'font-medium text-brand' : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
