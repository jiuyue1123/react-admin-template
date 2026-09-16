import type { NextConfig } from 'next'

/**
 * 访客端（租户站点渲染端）Next 配置
 *
 * - 多租户共用一个部署：后端按请求 Host 解析租户，前端不感知租户身份
 * - 未启用 cacheComponents：本应用全部路由都依赖请求 Host 做动态渲染，
 *   不需要组件级缓存；且启用后 `dynamic`/`revalidate` 段配置会被移除。
 *   后续要做缓存时再统一迁移到 `use cache` + `cacheTag`。
 */
const nextConfig: NextConfig = {
  // 自托管部署产物（Docker 友好）
  output: 'standalone',
  // 租户站点的图片来自媒体库（七牛等外域）。本应用不使用 next/image
  // （Puck 区块均为 <img>），因此不配置 remotePatterns —— 避免出现
  // 通配 hostname 带来的图片优化 SSRF 面。将来若启用 next/image，
  // 在此精确列出 CDN 域名。
}

export default nextConfig
