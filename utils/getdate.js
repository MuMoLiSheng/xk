import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import https from 'https'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import setting from "../models/setting.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export function getFunctionData(AppName, YamlName, ArrayName, Function) {
    const Config = setting.getConfig(AppName, YamlName)
    const functionData = Config[ArrayName].find(item => item.FunctionName === Function) || Config[ArrayName].find(item => item.FunctionName === 'default')
    return functionData
}

export async function readAndParseJSON(filePath) {
    try {
        const fileContent = await fs.promises.readFile(path.join(__dirname, filePath), 'utf8')
        return JSON.parse(fileContent)
    } catch (e) {
        logger.info(`${chalk.rgb(240, 75, 60)(`[小可]json读取失败`)}`)
    }
}

export async function getRandomImage(category) {
  let file
  if (['pc', 'mb', 'sq'].includes(category)) {
      file = await readCategoryFiles(category)
  } else {
      const allFiles = await Promise.all(['pc', 'mb', 'sq'].map(readCategoryFiles))
      file = getRandomFile([].concat(...allFiles))
  }
  let basename = file.split('.')[0]
  let imageUrl = `https://pixiv.nl/${basename}.jpg`
  return imageUrl
  }
  
  function getRandomFile(category) {
  let allFiles = [].concat(...Object.values(category))
  return allFiles[Math.floor(Math.random() * allFiles.length)]
  }

  export function getTimeOfDay() {
    let date = new Date()
    let hours = date.getHours()

    let timeOfDay
    if (hours >= 0 && hours < 6) {
        timeOfDay = '凌晨'
    } else if (hours >= 6 && hours < 12) {
        timeOfDay = '上午'
    } else if (hours >= 12 && hours < 18) {
        timeOfDay = '下午'
    } else {
        timeOfDay = '晚上'
    }

    return timeOfDay
  }

  export async function numToChinese(num) {
    const units = ['', '十', '百', '千']
    const nums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    let result = ''
    const strNum = num.toString()
    const len = strNum.length
    for(let i = 0; i < len; i++) {
        const curNum = parseInt(strNum[i])
        const unit = units[len - 1 - i]
        if(curNum === 0) {
            if(result.slice(-1) !== '零') {
                result += '零'
            }
        } else {
            result += nums[curNum] + unit
        }
    }
    return result.replace(/零+$/, '')
}

export async function getImageUrl(imageUrls, defaultImageUrl = './plugins/xk/resources/gallery/92095127.webp') {
  let imageUrl = await getRandomUrl(imageUrls)

  return new Promise((resolve, reject) => {
      const getAndResolveImage = (url) => {
          https.get(url, (res) => {
              const { statusCode } = res
              if (statusCode === 301 || statusCode === 302) {
                  // 如果状态码是301或302，那么从'location'头部获取重定向的URL
                  getAndResolveImage(res.headers.location)
              } else if (statusCode !== 200) {
                  resolve(getImageData(defaultImageUrl))
              } else {
                  resolve(url)
              }
          }).on('error', () => {
              resolve(getImageData(defaultImageUrl))
          })
      }
      const getImageData = (imageUrl) => {
          if (fs.existsSync(imageUrl)) {
              let imageBuffer = fs.readFileSync(imageUrl)
              let ext = path.extname(imageUrl).slice(1)
              let mimeType = 'image/' + ext
              let base64Image = imageBuffer.toString('base64')
              imageUrl = 'data:' + mimeType + 'base64,' + base64Image
          }
          return imageUrl
      }
      if (imageUrl.startsWith('http')) {
          getAndResolveImage(imageUrl)
      } else {
          resolve(getImageData(imageUrl))
      }
  })
}

async function getAllImageFiles(dirPath, imageFiles = []) {
  let files = fs.readdirSync(dirPath)
  for (let i = 0; i < files.length; i++) {
      let filePath = path.join(dirPath, files[i])

      if (fs.statSync(filePath).isDirectory()) {
          imageFiles = await getAllImageFiles(filePath, imageFiles)
      } else if (['.jpg', '.png', '.gif', '.jpeg', '.webp'].includes(path.extname(filePath))) {
          imageFiles.push(filePath)
      }
  }
  return imageFiles
}

export async function getRandomUrl(imageUrls) {
  let imageUrl
  if (Array.isArray(imageUrls)) {
      imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)]
  } else {
      imageUrl = imageUrls
  }
  if (fs.existsSync(imageUrl) && fs.lstatSync(imageUrl).isDirectory()) {
      let imageFiles = await getAllImageFiles(imageUrl)

      if (imageFiles.length > 0) {
          imageUrl = imageFiles[Math.floor(Math.random() * imageFiles.length)]
      }
  }

  logger.info(`${chalk.rgb(255, 225, 255)(`[小可]图片url：`+imageUrl)}`)
  return imageUrl
}