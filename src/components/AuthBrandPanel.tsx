import {
  ApartmentOutlined,
  CustomerServiceOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'

const FEATURES = [
  { icon: <ApartmentOutlined />, title: '多租户管理', desc: '组织空间独立，数据安全隔离' },
  { icon: <SafetyCertificateOutlined />, title: '安全认证', desc: '短信验证码 + 双令牌保障' },
  { icon: <CustomerServiceOutlined />, title: '在线客服', desc: '问题实时响应，服务不间断' },
]

/**
 * 登录/注册页左侧品牌面板：品牌色渐变 + 网格 + 光斑，
 * 浅深色主题下视觉一致；< lg 宽度时隐藏
 */
export default function AuthBrandPanel() {
  return (
    <aside
      className="jff-anim relative hidden shrink-0 overflow-hidden lg:flex lg:w-[46%]"
      style={{
        background:
          'linear-gradient(155deg, var(--tp-primary-active) 0%, var(--tp-primary) 42%, #1e40af 100%)',
      }}
    >
      {/* 装饰网格（径向蒙版淡出） */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.45) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          WebkitMaskImage: 'radial-gradient(85% 85% at 25% 20%, #000 30%, transparent 100%)',
          maskImage: 'radial-gradient(85% 85% at 25% 20%, #000 30%, transparent 100%)',
        }}
      />
      {/* 柔和光斑 */}
      <div className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -left-24 h-[30rem] w-[30rem] rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-1 flex-col justify-between p-12 text-white">
        {/* 品牌标识 */}
        <div className="jff-anim flex items-center gap-3" style={{ animationDelay: '80ms' }}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-semibold ring-1 ring-white/25 backdrop-blur">
            简
          </div>
          <div>
            <div className="text-lg font-semibold leading-tight">简帆坊</div>
            <div className="text-xs tracking-[0.28em] text-white/60">TENANT PORTAL</div>
          </div>
        </div>

        {/* 卖点文案 */}
        <div>
          <h2
            className="jff-anim text-[1.75rem] font-semibold leading-snug"
            style={{ animationDelay: '160ms' }}
          >
            多租户 SaaS 管理平台
            <br />
            让企业管理更简单
          </h2>
          <p
            className="jff-anim mt-4 max-w-sm text-sm leading-6 text-white/70"
            style={{ animationDelay: '240ms' }}
          >
            简帆坊租户端，一站式完成账号注册、登录与自助管理。
          </p>

          <ul className="mt-10 space-y-5">
            {FEATURES.map((feature, index) => (
              <li
                key={feature.title}
                className="jff-anim flex items-start gap-3"
                style={{ animationDelay: `${320 + index * 80}ms` }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/25">
                  {feature.icon}
                </div>
                <div>
                  <div className="text-sm font-medium">{feature.title}</div>
                  <div className="mt-0.5 text-xs text-white/60">{feature.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 底部 */}
        <div className="jff-anim text-xs text-white/50" style={{ animationDelay: '600ms' }}>
          © 简帆坊 · 租户管理平台
        </div>
      </div>
    </aside>
  )
}
