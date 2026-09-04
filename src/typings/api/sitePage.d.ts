declare namespace Api {
    /**
     * namespace SitePage
     *
     * backend api module: "tenant/site/pages"
     */
    namespace SitePage {
        /** 页面状态：0-草稿 1-已发布 2-已下线 */
        type PageState = 0 | 1 | 2

        /** 站点页面信息（对齐 SitePageVO） */
        interface SitePageVO {
            /** 页面ID */
            id: number
            /** 页面标题 */
            pageTitle: string
            /** 页面路径 */
            pagePath: string
            /** 页面状态：0-草稿 1-已发布 2-已下线 */
            pageState: PageState
            /** 排序号 */
            sortOrder: number
            /** 创建时间 */
            gmtCreate: string
            /** 修改时间 */
            gmtModified: string
        }

        /** 站点页面详情（对齐 SitePageDetailVO） */
        interface SitePageDetailVO extends SitePageVO {
            /** 页面内容（Puck JSON 字符串） */
            content: string
            /** 当前版本号 */
            version: number
        }

        /** 站点页面版本信息（对齐 SitePageVersionVO） */
        interface SitePageVersionVO {
            /** 版本ID */
            id: number
            /** 版本号 */
            version: number
            /** 该版本页面标题 */
            pageTitle: string
            /** 保存时间 */
            gmtCreate: string
        }

        /** 新增页面请求（对齐 SitePageCreateRequest） */
        interface SitePageCreateParams {
            /** 页面标题 */
            pageTitle: string
            /** 页面路径，同租户内唯一 */
            pagePath: string
            /** 页面内容（Puck JSON），可不传为空页面 */
            content?: string
            /** 排序号 */
            sortOrder?: number
        }

        /** 更新页面请求（对齐 SitePageUpdateRequest） */
        interface SitePageUpdateParams {
            /** 页面标题 */
            pageTitle: string
            /** 页面路径，同租户内唯一 */
            pagePath: string
            /** 页面状态，传 null 表示不修改 */
            pageState?: PageState | null
            /** 排序号，传 null 表示不修改 */
            sortOrder?: number | null
        }

        /** 页面内容保存请求（对齐 SitePageContentRequest） */
        interface SitePageContentParams {
            /** 页面内容（Puck JSON 字符串） */
            content: string
        }

        /** 排序项（对齐 Item） */
        interface SitePageSortItem {
            /** 页面ID */
            id: number
            /** 排序号 */
            sortOrder: number
        }

        /** 批量排序请求（对齐 SitePageSortRequest） */
        interface SitePageSortParams {
            /** 排序项列表（按期望顺序） */
            items: SitePageSortItem[]
        }
    }
}
