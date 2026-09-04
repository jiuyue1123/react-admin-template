import { request } from '../request';

/** 查询参数序列化：剔除 undefined */
function toParams(params: Record<string, number | undefined>) {
    const result: Record<string, number> = {}
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) result[key] = value
    }
    return Object.keys(result).length ? result : undefined
}

/** 媒体列表（folderId / fileType 可选） */
export function fetchGetMedia(folderId?: number, fileType?: number) {
    return request.Get<Api.Media.MediaAssetVO[]>('/tenant/media', {
        params: toParams({ folderId, fileType }),
    })
}

/** 上传媒体（multipart/form-data） */
export function fetchUploadMedia(file: File, folderId?: number) {
    const formData = new FormData()
    formData.append('file', file)
    return request.Post<Api.Media.MediaAssetVO>('/tenant/media', formData, {
        params: toParams({ folderId }),
    })
}

/** 删除媒体 */
export function fetchDeleteMedia(id: number) {
    return request.Delete<void>(`/tenant/media/${id}`)
}

/** 文件夹列表（parentId 可选，默认根目录） */
export function fetchGetFolders(parentId?: number) {
    return request.Get<Api.Media.MediaFolderVO[]>('/tenant/media/folders', {
        params: toParams({ parentId }),
    })
}

/** 创建文件夹 */
export function fetchCreateFolder(params: Api.Media.MediaFolderCreateParams) {
    return request.Post<Api.Media.MediaFolderVO>('/tenant/media/folders', params)
}

/** 重命名文件夹 */
export function fetchRenameFolder(id: number, folderName: string) {
    return request.Put<Api.Media.MediaFolderVO>(`/tenant/media/folders/${id}`, { folderName })
}

/** 删除文件夹 */
export function fetchDeleteFolder(id: number) {
    return request.Delete<void>(`/tenant/media/folders/${id}`)
}
