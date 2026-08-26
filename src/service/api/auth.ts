import { request } from '../request';

/**
 * 发送短信验证码
 *
 * @param phone 手机号
 * @param scene 验证码场景（TENANT_LOGIN / TENANT_REGISTER 等）
 */
export function fetchSendCode(phone: string, scene: Api.Auth.SmsScene) {
    return request.Post<void>('/tenant/auth/send-code', { phone, scene });
}

/** 租户注册（成功直接返回访问令牌与刷新令牌） */
export function fetchRegister(params: Api.Auth.RegisterParams) {
    return request.Post<Api.Auth.LoginToken>('/tenant/auth/register', params);
}

/** 手机号 + 密码登录 */
export function fetchLoginByPassword(phone: string, password: string) {
    return request.Post<Api.Auth.LoginToken>('/tenant/auth/login/password', {
        phone,
        password,
    });
}

/** 手机号 + 验证码登录 */
export function fetchLoginByCode(phone: string, code: string) {
    return request.Post<Api.Auth.LoginToken>('/tenant/auth/login/code', {
        phone,
        code,
    });
}

/** 刷新访问令牌（用旧 refreshToken 换取新令牌） */
export function fetchRefreshToken(refreshToken: string) {
    return request.Post<Api.Auth.LoginToken>('/tenant/auth/refresh', { refreshToken });
}

/** 租户登出（吊销 refreshToken） */
export function fetchLogout(refreshToken: string) {
    return request.Post<void>('/tenant/auth/logout', { refreshToken });
}

/** 获取当前租户 Profile */
export function fetchGetProfile() {
    return request.Get<Api.Auth.TenantProfile>('/tenant/profile');
}

/** 更新租户 Profile */
export function fetchUpdateProfile(params: Api.Auth.ProfileUpdateParams) {
    return request.Put<Api.Auth.TenantProfile>('/tenant/profile', params);
}

/** 换绑手机号 */
export function fetchChangePhone(params: Api.Auth.PhoneChangeParams) {
    return request.Post<void>('/tenant/auth/phone/change', params);
}

/** 重置登录密码（登录后在个人中心「修改密码」使用） */
export function fetchResetPassword(params: Api.Auth.ResetPasswordParams) {
    return request.Post<void>('/tenant/auth/password/reset', params);
}
