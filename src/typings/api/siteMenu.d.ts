declare namespace Api {
    /**
     * namespace SiteMenu
     *
     * backend api module: "tenant/site/menus"
     */
    namespace SiteMenu {
        /** 链接类型：1-站点页面 2-自定义URL */
        type MenuLinkType = 1 | 2

        /** 站点导航菜单信息（对齐 SiteMenuVO） */
        interface SiteMenuVO {
            /** 导航项ID */
            id: number
            /** 父菜单ID，0-顶级 */
            parentId: number
            /** 菜单名称 */
            menuName: string
            /** 链接类型：1-站点页面 2-自定义URL */
            linkType: MenuLinkType
            /** 链接目标（页面ID或URL） */
            linkTarget: string
            /** 排序号 */
            sortOrder: number
        }

        /** 新增导航项请求（对齐 SiteMenuCreateRequest） */
        interface SiteMenuCreateParams {
            /** 菜单名称 */
            menuName: string
            /** 链接类型：1-站点页面 2-自定义URL */
            linkType: MenuLinkType
            /** 链接目标（页面ID或URL） */
            linkTarget: string
            /** 父菜单ID，默认0（顶级） */
            parentId?: number
            /** 排序号，默认0 */
            sortOrder?: number
        }

        /** 更新导航项请求（对齐 SiteMenuUpdateRequest） */
        interface SiteMenuUpdateParams {
            /** 菜单名称 */
            menuName: string
            /** 链接类型：1-站点页面 2-自定义URL */
            linkType: MenuLinkType
            /** 链接目标（页面ID或URL） */
            linkTarget: string
            /** 排序号，传 null 表示不修改 */
            sortOrder?: number | null
        }

        /** 排序项（对齐 Item） */
        interface SiteMenuSortItem {
            /** 导航项ID */
            id: number
            /** 排序号 */
            sortOrder: number
        }

        /** 批量排序请求（对齐 SiteMenuSortRequest） */
        interface SiteMenuSortParams {
            /** 排序项列表（按期望顺序） */
            items: SiteMenuSortItem[]
        }
    }
}
