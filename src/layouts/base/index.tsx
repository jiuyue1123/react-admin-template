import { Outlet } from 'react-router-dom'

/** base 布局：带应用外壳（顶栏 + 内容区），用于主业务页面 */
export default function BaseLayout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f5f5',
      }}
    >
      <header
        style={{
          height: 56,
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          borderBottom: '1px solid #e5e5e5',
          fontWeight: 600,
        }}
      >
        React Admin Template
      </header>
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}
