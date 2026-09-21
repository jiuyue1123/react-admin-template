import { App } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useQuotaStore } from '@/store/quota'
import { formatQuotaBytes } from '@/utils/quota'

/**
 * 额度守卫 —— 操作前校验，超额直接引导升级
 *
 * 为什么要事前拦截而不是等后端报错：
 *   1. 错误码 20315 / 21006 / 20316 是**业务态**，不该走通用错误弹窗；
 *   2. 请求层的拦截器只抛出 `msg`、不带 code，页面无法区分「额度不足」与「普通失败」；
 *   3. 不发请求就没有任何错误提示噪音，用户体验也更好。
 *
 * 判断条件与后端执法点一致（尤其存储是 `已用 + 本次文件 > 上限`）。
 *
 * **拿不到额度时放行**（fail-open）：额度接口失败不应该让用户连操作都做不了，
 * 真超了后端会拦下并给出「升级套餐后可继续」的文案。
 */

type QuotaKind = 'page' | 'storage' | 'homeDelivery'

const QUOTA_META: Record<QuotaKind, { label: string; hint: string }> = {
  page: { label: '内页数量', hint: '升级套餐后可继续添加内页。' },
  storage: { label: '存储空间', hint: '升级套餐可扩容；也可以先删除一些不再使用的素材。' },
  homeDelivery: { label: '定制首页交付套数', hint: '升级套餐后可继续交付定制首页。' },
}

export function useQuotaGate() {
  const { modal } = App.useApp()
  const navigate = useNavigate()
  const refresh = useQuotaStore(state => state.refresh)

  /** 弹升级引导（照 site 页 handlePublish 的 modal.info + navigate 范式） */
  const showUpgrade = (kind: QuotaKind, usage: string, planName?: string | null) => {
    const meta = QUOTA_META[kind]
    modal.info({
      title: '套餐额度已用尽',
      content: (
        <div className="text-sm text-text-secondary">
          <div className="text-text">
            {meta.label}：{usage}
          </div>
          <div className="mt-2">{meta.hint}</div>
          {planName ? <div className="mt-2">当前套餐：{planName}</div> : null}
        </div>
      ),
      okText: '去升级套餐',
      onOk: () => navigate('/billing/plans'),
    })
  }

  /** 建页前守卫：内页数已达上限则引导升级并返回 false */
  const guardPage = async (): Promise<boolean> => {
    const quota = await refresh(true)
    if (!quota) return true

    const { pageUsed, pageLimit } = quota
    if (pageLimit == null || pageUsed < pageLimit) return true

    showUpgrade('page', `${pageUsed} / ${pageLimit}`, quota.planName)
    return false
  }

  /**
   * 上传前守卫：加上本次文件后会超限则引导升级
   *
   * 与后端一致用的是「已用 + incoming > 上限」而不是「已用 >= 上限」——
   * 后者会放过「刚好差一点点」的文件，让用户传完才被拒。
   */
  const guardStorage = async (incomingBytes: number): Promise<boolean> => {
    const quota = await refresh(true)
    if (!quota) return true

    const { storageUsedBytes, storageLimitBytes } = quota
    if (storageLimitBytes == null || storageUsedBytes + incomingBytes <= storageLimitBytes) return true

    showUpgrade(
      'storage',
      `${formatQuotaBytes(storageUsedBytes)} / ${formatQuotaBytes(storageLimitBytes)}`,
      quota.planName,
    )
    return false
  }

  /** 验收定制首页前守卫：交付套数已达上限则引导升级 */
  const guardHomeDelivery = async (): Promise<boolean> => {
    const quota = await refresh(true)
    if (!quota) return true

    const { homeDeliveryUsed, homeDeliveryLimit } = quota
    if (homeDeliveryLimit == null || homeDeliveryUsed < homeDeliveryLimit) return true

    showUpgrade('homeDelivery', `${homeDeliveryUsed} / ${homeDeliveryLimit}`, quota.planName)
    return false
  }

  return { guardPage, guardStorage, guardHomeDelivery }
}
