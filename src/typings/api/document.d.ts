declare namespace Api {
    /**
     * namespace Document
     *
     * backend api module: "content"（公开端已发布文档）
     */
    namespace Document {
        /** 已发布文档信息（对齐 ContentDocumentPublishedVO） */
        interface PublishedDocument {
            /** 文档编码 */
            docKey: string;
            /** 文档类型 */
            docType: number;
            /** 分类 */
            category: string;
            /** 标题 */
            title: string;
            /** 正文（Markdown） */
            content: string;
            /** 是否置顶 */
            isPinned: number;
            /** 发布时间 */
            publishAt: string;
            /** 版本号 */
            version: number;
        }
    }
}
