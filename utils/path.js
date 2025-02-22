/**
 * 根据文件路径计算xk路径及yunzai路径
 * 规避在外部import，在非yunzai根目录执行时，使用process.cwd()查找文件有可能错误的问题
 */
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// xk根路径
const xkPath = path.join(__dirname, '..')
// yunzai根路径
const rootPath = path.join(xkPath, '..', '..')

export { xkPath, rootPath }
