import { request } from '../request';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(username: string, password: string) {
    return request.Post<Api.Auth.LoginToken>('/admin/auth/login', { username, password });
}

/** Get user info */
export function fetchGetUserInfo() {
    return request.Get<Api.Auth.UserInfo>('/admin/auth/userinfo');
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
    return request.Post<Api.Auth.LoginToken>('/admin/auth/refresh', { refreshToken });
}