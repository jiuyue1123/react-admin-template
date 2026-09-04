// ---------------------------------------------------------------------------
// 实名认证相关枚举与判定（取值来自后端 SQL / 文档）
// ---------------------------------------------------------------------------

interface MetaItem {
  label: string
  color: string
}

/** 认证类型：1-企业 2-个人 */
export const VERIFY_TYPE_META: Record<number, MetaItem> = {
  1: { label: '企业认证', color: 'geekblue' },
  2: { label: '个人认证', color: 'cyan' },
}

/** 审核状态：0-待审核 1-已通过 2-已拒绝 */
export const VERIFY_STATE_META: Record<number, MetaItem> = {
  0: { label: '待审核', color: 'gold' },
  1: { label: '已通过', color: 'success' },
  2: { label: '已拒绝', color: 'error' },
}

export function getVerifyTypeMeta(type?: number): MetaItem {
  return VERIFY_TYPE_META[type ?? -1] ?? { label: '未知', color: 'default' }
}

export function getVerifyStateMeta(state?: number): MetaItem {
  return VERIFY_STATE_META[state ?? -1] ?? { label: '未知', color: 'default' }
}

/**
 * 是否通过实名认证且未过期。
 * 有效期字段 verifiedExpireAt 缺失视为长期有效（以后端为准）。
 */
export function isVerificationPassed(verification?: Api.Verification.VerificationVO | null): boolean {
  if (!verification || verification.verifyState !== 1) return false
  if (verification.verifiedExpireAt) {
    const expireTime = new Date(verification.verifiedExpireAt).getTime()
    if (!Number.isNaN(expireTime) && expireTime <= Date.now()) return false
  }
  return true
}
