import Link from 'next/link'
import { isExternalHref, resolveMenuHref } from '@/lib/menu'
import type { PublicSiteMenu } from '@/lib/types'

/**
 * 导航链接
 *
 * 站内走客户端路由（<Link>），站外直跳并强制 noopener。
 * 无 'use client'：被服务端组件使用即为服务端组件，被客户端组件使用即并入客户端。
 */
export function MenuLink({
  menu,
  className,
  children,
  onClick,
}: {
  menu: PublicSiteMenu
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}) {
  const href = resolveMenuHref(menu)
  const content = children ?? menu.menuName

  if (isExternalHref(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {content}
    </Link>
  )
}

/** 导航项是否配置了可跳转地址（含子项的父级可能没有自身地址） */
export function hasOwnHref(menu: PublicSiteMenu): boolean {
  return !!menu.linkUrl?.trim()
}
