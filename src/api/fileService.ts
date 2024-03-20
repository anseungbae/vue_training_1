import { get } from '@/config/axios.ts'

export const URL_FILE_DOWNLOAD = '/file/aws-file-download' // 파일 다운로드 서비스
export const URL_ZIP_FILE_DOWNLOAD = '/file/aws-zip-file-download' // Zip 파일 다운로드 서비스
const fileDownload = (param) => get(URL_FILE_DOWNLOAD, param, { responseType: 'blob' })
const zipFileDownload = (param) => get(URL_ZIP_FILE_DOWNLOAD, param, { responseType: 'blob' })

const FileService = {
  fileDownload,
  zipFileDownload
}

export default FileService
