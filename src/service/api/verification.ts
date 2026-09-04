import { request } from '../request';

/** 当前实名认证状态（未提交过时后端可能返回 null/空，页面按此兼容） */
export function fetchGetVerification() {
    return request.Get<Api.Verification.VerificationVO | null>('/tenant/verification');
}

/** 提交实名认证（企业 / 个人，提交后进入人工审核） */
export function fetchSubmitVerification(params: Api.Verification.VerificationSubmitParams) {
    return request.Post<Api.Verification.VerificationVO>('/tenant/verification', params);
}
