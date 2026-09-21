declare namespace Api {
    /**
     * namespace Site
     *
     * backend api module: "tenant/site"
     */
    namespace Site {
        /** 站点信息（对齐 SiteVO） */
        interface SiteVO {
            /** 站点ID */
            id: number;
            /** 租户ID */
            tenantId: number;
            /** 站点名称 */
            siteName: string;
            /** 站点简介 */
            siteIntro: string;
            /** 站点 Logo URL */
            logo: string;
            /** 站点 Favicon URL */
            favicon: string;
            /** 平台子域名标签 */
            subdomain?: string;
            /** 站点公开访问地址 */
            siteUrl?: string;
            /** 站点状态（生命周期）：0-建设中 1-待发布 2-已上线 3-已到期 4-已退款 5-已归档 */
            siteState: number;
            /** 发布时间 */
            publishAt: string;
            /** 创建时间 */
            gmtCreate: string;
        }

        /** 更新站点请求（对齐 SiteUpdateRequest） */
        interface SiteUpdateParams {
            /** 站点名称 */
            siteName: string;
            /** 站点简介 */
            siteIntro?: string;
            /** 站点 Logo URL */
            logo?: string;
            /** 站点 Favicon URL */
            favicon?: string;
        }

        /** 建站环节进度（对齐 BuildProgressVO） */
        interface BuildProgressVO {
            /** 建站环节：1-设计 2-开发 3-测试 4-上线 */
            stage: number;
            /** 环节状态：0-未开始 1-进行中 2-已完成 */
            stageState: number;
            /** 备注 */
            remark?: string;
        }

        /** 站点生命周期状态 + 建站进度（对齐 SiteStatusVO） */
        interface SiteStatusVO {
            /** 站点ID */
            siteId: number;
            /** 站点名称 */
            siteName: string;
            /** 站点生命周期状态 */
            siteState: number;
            /** 发布时间 */
            publishAt?: string;
            /** 建站环节进度 */
            buildProgress: BuildProgressVO[];
        }
    }
}
