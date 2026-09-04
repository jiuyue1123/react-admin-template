declare namespace Api {
    /**
     * namespace Verification
     *
     * backend api module: "tenant/verification"
     * 字段对齐 docs/jff.md（小驼峰，与后端 VO 一致）
     */
    namespace Verification {
        /** 认证类型：1-企业 2-个人 */
        type VerifyType = 1 | 2

        /** 审核状态：0-待审核 1-已通过 2-已拒绝 */
        type VerifyState = 0 | 1 | 2

        /** 实名认证信息（对齐 VerificationVO） */
        interface VerificationVO {
            /** 认证记录ID */
            id: number
            /** 租户ID */
            tenantId: number
            /** 认证类型：1-企业 2-个人 */
            verifyType: VerifyType
            /** 企业名称 / 个人姓名 */
            legalName: string
            /** 统一社会信用代码（企业） */
            creditCode?: string
            /** 法定代表人（企业） */
            legalPerson?: string
            /** 营业执照图片 URL（企业） */
            businessLicense?: string
            /** 身份证号（个人，已脱敏） */
            idCardNo?: string
            /** 身份证正面 URL（个人） */
            idCardFront?: string
            /** 身份证背面 URL（个人） */
            idCardBack?: string
            /** 审核状态 */
            verifyState: VerifyState
            /** 驳回原因 */
            rejectReason?: string
            /** 审核通过时间 */
            verifiedAt?: string
            /** 认证有效期至 */
            verifiedExpireAt?: string
            /** 创建时间 */
            gmtCreate: string
        }

        /** 提交实名认证请求（对齐 VerificationSubmitRequest；企业/个人按 verifyType 提交对应组） */
        interface VerificationSubmitParams {
            /** 认证类型：1-企业 2-个人 */
            verifyType: VerifyType
            /** 企业名称 / 个人姓名 */
            legalName: string
            /** 统一社会信用代码（企业必填） */
            creditCode?: string
            /** 法定代表人（企业必填） */
            legalPerson?: string
            /** 营业执照图片 URL（企业必填） */
            businessLicense?: string
            /** 身份证号（个人必填） */
            idCardNo?: string
            /** 身份证正面 URL（个人必填） */
            idCardFront?: string
            /** 身份证背面 URL（个人必填） */
            idCardBack?: string
        }
    }
}
