declare namespace Api {
    /**
     * namespace Media
     *
     * backend api module: "tenant/media"
     */
    namespace Media {
        /** 媒体资产信息（对齐 MediaAssetVO） */
        interface MediaAssetVO {
            /** 媒体ID */
            id: number;
            /** 所属文件夹ID，0-根目录 */
            folderId: number;
            /** 原始文件名 */
            fileName: string;
            /** 文件类型：1-图片 2-视频 3-文件 */
            fileType: number;
            /** MIME 类型 */
            contentType: string;
            /** 文件访问 URL */
            url: string;
            /** 文件大小（字节） */
            fileSize: number;
            /** 图片宽度 */
            width: number;
            /** 图片高度 */
            height: number;
            /** 创建时间 */
            gmtCreate: string;
        }

        /** 媒体文件夹信息（对齐 MediaFolderVO） */
        interface MediaFolderVO {
            /** 文件夹ID */
            id: number;
            /** 父文件夹ID，0-根目录 */
            parentId: number;
            /** 文件夹名称 */
            folderName: string;
            /** 排序号 */
            sortOrder: number;
        }

        /** 创建媒体文件夹请求（对齐 MediaFolderCreateRequest） */
        interface MediaFolderCreateParams {
            /** 文件夹名称 */
            folderName: string;
            /** 父文件夹ID，不传或0为根目录 */
            parentId?: number;
            /** 排序号 */
            sortOrder?: number;
        }

        /** 重命名媒体文件夹请求（对齐 MediaFolderRenameRequest） */
        interface MediaFolderRenameParams {
            /** 文件夹名称 */
            folderName: string;
        }
    }
}
