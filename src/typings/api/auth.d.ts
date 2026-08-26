declare namespace Api {
    /**
     * namespace Auth
     *
     * backend api module: "tenant/auth"
     */
    namespace Auth {
        /** 租户登录结果（访问令牌 + 刷新令牌） */
        interface LoginToken {
            accessToken: string;
            refreshToken: string;
        }

        /** 短信验证码场景（对齐后端 SmsCodeRequest.scene 枚举） */
        type SmsScene =
            | 'LOGIN'
            | 'REGISTER'
            | 'RESET_PASSWORD'
            | 'BIND_PHONE'
            | 'CHANGE_PHONE'
            | 'TENANT_REGISTER'
            | 'TENANT_LOGIN';

        /** 租户注册请求 */
        interface RegisterParams {
            /** 租户名称（公司/组织名） */
            tenantName: string;
            /** 联系人手机号 */
            phone: string;
            /** 密码 */
            password: string;
            /** 短信验证码 */
            code: string;
        }

        /** 租户登录请求（手机号 + 密码） */
        interface PasswordLoginParams {
            phone: string;
            password: string;
        }

        /** 租户登录请求（手机号 + 验证码） */
        interface CodeLoginParams {
            phone: string;
            code: string;
        }

        /** 租户 Profile（对齐 TenantProfileVO） */
        interface TenantProfile {
            /** 租户ID */
            tenantId: number;
            /** 租户名称 */
            tenantName: string;
            /** 租户编码 */
            tenantCode: string;
            /** 联系人姓名 */
            contactName: string;
            /** 联系人手机号 */
            contactPhone: string;
            /** 联系人邮箱 */
            contactEmail: string;
            /** 租户备注 */
            remark: string;
            /** 用户ID */
            userId: number;
            /** 用户名 */
            username: string;
            /** 昵称 */
            nickname: string;
            /** 手机号 */
            phone: string;
            /** 邮箱 */
            email: string;
            /** 头像 URL */
            avatar: string;
            /** 性别：0-保密 1-男 2-女 */
            gender: number;
        }

        /** 更新租户 Profile 请求（对齐 TenantProfileUpdateRequest） */
        interface ProfileUpdateParams {
            /** 租户名称 */
            tenantName: string;
            /** 联系人姓名 */
            contactName?: string;
            /** 联系人邮箱 */
            contactEmail?: string;
            /** 租户备注 */
            remark?: string;
            /** 昵称 */
            nickname?: string;
            /** 邮箱 */
            email?: string;
            /** 头像 URL */
            avatar?: string;
            /** 性别：0-保密 1-男 2-女 */
            gender?: number;
        }

        /** 换绑手机号请求（对齐 TenantPhoneChangeRequest） */
        interface PhoneChangeParams {
            /** 新手机号 */
            newPhone: string;
            /** 发送到当前手机号的验证码 */
            oldPhoneCode: string;
            /** 发送到新手机号的验证码 */
            newPhoneCode: string;
        }

        /** 重置登录密码请求（对齐 TenantResetPasswordRequest） */
        interface ResetPasswordParams {
            /** 手机号 */
            phone: string;
            /** 短信验证码 */
            code: string;
            /** 新密码 */
            newPassword: string;
            /** 当前 refreshToken，重置后加入黑名单 */
            refreshToken: string;
        }
    }
}
