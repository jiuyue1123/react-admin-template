/**
 * 提交后端返回的支付表单（支付宝「电脑网站支付」返回 HTML），在新标签页跳转收银台。
 * 支付宝页面的返回地址由后端 return_url 处理，前端无需新增路由。
 *
 * @returns 是否成功取得表单并触发提交
 */
export function submitPayForm(payForm?: string | null): boolean {
  if (!payForm) return false

  const wrapper = document.createElement('div')
  wrapper.innerHTML = payForm
  const form = wrapper.querySelector('form') as HTMLFormElement | null

  if (form) {
    form.setAttribute('target', '_blank')
    wrapper.style.display = 'none'
    document.body.appendChild(wrapper)
    form.submit()
    // 提交后清理占位节点，避免残留
    window.setTimeout(() => {
      wrapper.remove()
    }, 3000)
    return true
  }

  wrapper.remove()
  return false
}
