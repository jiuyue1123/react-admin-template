/** 媒体文件类型（对齐后端枚举：1-图片 2-视频 3-文件） */
export const MEDIA_FILE_TYPE = {
    IMAGE: 1,
    VIDEO: 2,
    FILE: 3,
} as const

/** 文件类型 → 中文标签 */
export function getMediaTypeLabel(type?: number): string {
    switch (type) {
        case MEDIA_FILE_TYPE.IMAGE:
            return '图片'
        case MEDIA_FILE_TYPE.VIDEO:
            return '视频'
        case MEDIA_FILE_TYPE.FILE:
            return '文件'
        default:
            return '文件'
    }
}

/** 字节 → 可读大小，如 1.5 MB */
export function formatFileSize(size?: number): string {
    if (size == null || size <= 0) return '-'
    const units = ['B', 'KB', 'MB', 'GB']
    let value = size
    let unit = 0
    while (value >= 1024 && unit < units.length - 1) {
        value /= 1024
        unit += 1
    }
    return `${value >= 100 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`
}

/** 从文件名提取扩展名（小写、无点） */
export function getFileExtension(fileName?: string): string {
    if (!fileName) return ''
    const dot = fileName.lastIndexOf('.')
    return dot >= 0 ? fileName.slice(dot + 1).toLowerCase() : ''
}

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v', 'ogg']

/** 判断是否为图片媒体 */
export function isImageMedia(media: Api.Media.MediaAssetVO): boolean {
    if (media.fileType === MEDIA_FILE_TYPE.IMAGE) return true
    if (media.contentType?.startsWith('image/')) return true
    return IMAGE_EXTENSIONS.includes(getFileExtension(media.fileName))
}

/** 判断是否为视频媒体 */
export function isVideoMedia(media: Api.Media.MediaAssetVO): boolean {
    if (media.fileType === MEDIA_FILE_TYPE.VIDEO) return true
    if (media.contentType?.startsWith('video/')) return true
    return VIDEO_EXTENSIONS.includes(getFileExtension(media.fileName))
}
