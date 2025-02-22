import fs from 'fs'
import path from 'path'
import chalk from "chalk"
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import puppeteer from 'puppeteer'
import common from '../../../lib/common/common.js' 
import { rulePrefix } from '../../StarRail-plugin/utils/common.js'
import { xkPath } from '#xk.path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class TextMsg extends plugin {
    constructor() {
        super({
            name: `${chalk.rgb(255, 225, 255)(`[小可]塔罗牌、占卜`)}`,
            dsc: '塔罗牌、占卜',  // 插件描述            
            event: 'message',  // 更多监听事件请参考下方的 Events
            priority: 5000,   // 插件优先度，数字越小优先度越高
            rule: [
                {
                    reg: `^(#|${rulePrefix}|%)(塔罗牌|塔罗)(.*)$`,   // 正则表达式,有关正则表达式请自行百度
                    fnc: '塔罗牌'  // 执行方法
                },
                {
                  reg: '^#?(占卜)(.*)$',   // 正则表达式,有关正则表达式请自行百度
                  fnc: '占卜'  // 执行方法
                },
            ]
        })
}

    async 塔罗牌(e) {
        await 抽塔罗牌(e)
        return true
    }

    async 占卜(e) {
        await 占卜塔罗牌(e)
        return true
    }

}

const tarot = await readAndParseJSON(`../data/tarot.json`)

async function 抽塔罗牌(e) {
  // 获取所有塔罗牌的键并随机选择一张塔罗牌
  const keys = Object.keys(tarot.cards)
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  const randomCard = tarot.cards[randomKey]

  // 获取塔罗牌的图片URL
const imageUrl = `https://gitee.com/Mu_Ling_Er/xk/raw/master/data/tarot/${randomCard.type}/${randomCard.pic}.webp`

  // 创建塔罗牌的正位和逆位选项并随机选择一个选项
  const options = [`正位: ${randomCard.meaning.up}`, `逆位: ${randomCard.meaning.down}`]
  const selection = options[Math.floor(Math.random() * options.length)]
  let [position, meaning] = selection.split(': ')
  let browser
  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()

  let Html = `
  <html style="background: rgba(255, 255, 255, 0.6)">
  <head>
    <style>
    html, body {
        margin: 0;
        padding: 0;
        font-family: '华康方圆体W7(P)', "华康方圆体W7(P)", '华康方圆体W7(P)', "华康方圆体W7(P)", '华康方圆体W7(P)', "华康方圆体W7(P)", "华康方圆体W7(P)", sans-serif;
    }         
    </style>
  </head>
  <div class="fortune" style="width: 35%; height: 65rem; float: left; text-align: center; background: rgba(255, 255, 255, 0.6);">
    <h2>${randomCard.name_cn}</h2>
    <p>${randomCard.name_en}</p>
    <div class="content" style="margin: 0 auto; padding: 12px 12px; height: 49rem; max-width: 980px; max-height: 1024px; background: rgba(255, 255, 255, 0.6); border-radius: 22px; backdrop-filter: blur(3px); box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3); writing-mode: vertical-rl; text-orientation: mixed;">
    <p style="font-size: 20px;">${position === '正位' ? randomCard.info.description : randomCard.info.reverseDescription}</p>
    </div>
    <h2>「${position}」${meaning}</h2>
    <br>
    <p>Create By 可歌岁月</p>
  </div>
  <div class="image" style="height:65rem; width: 65%; float: right; box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3); text-align: center;">
    <img src=${imageUrl} style="height: 100%; filter: brightness(100%); overflow: hidden; display: inline-block; vertical-align: middle; margin: 0; padding: 0;"/>
  </div>
</html>
  `

    await page.setContent(Html)
    const tarotimage = Buffer.from(await page.screenshot({ fullPage: true }))
    e.reply([`「${position}」${randomCard.name_cn} (${randomCard.name_en})\n卡牌回应：${meaning}\n卡牌描述：${position === '正位' ? randomCard.info.description : randomCard.info.reverseDescription}`,segment.image(tarotimage)], false, { at : true })
  } catch (error) {
    logger.error(error)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
  return true
}


async function 占卜塔罗牌(e, replacedMsg = '') {
  const forward = ["正在为您抽牌……"]
  const keys = Object.keys(tarot.cards)
  const randomCards = []
  const cardPositions = []

  for(let i = 0; i < 3; i++) {
    let randomCard
    do {
      const randomIndex = Math.floor(Math.random() * keys.length)
      const randomKey = keys[randomIndex]
      randomCard = tarot.cards[randomKey]
    } while(randomCards.includes(randomCard))

    randomCards.push(randomCard)

    const position = Math.random() < 0.5 ? 'up' : 'down'
    cardPositions.push(position)

    const imageUrl = `${xkPath}/data/tarot/${randomCard.type}/${randomCard.pic}.png`

    const forwardMsg = [
      `你抽到的第${i+1}张牌是 ${randomCard.name_cn} (${randomCard.name_en})\n\n${position === 'up' ? '「正位」' : '「逆位」'}：${randomCard.meaning[position]}\n\n卡牌描述：${position === 'up' ? randomCard.info.description : randomCard.info.reverseDescription}`,
      segment.image(imageUrl)
    ]

    forward.push(forwardMsg)
  }
  let nickname = e.nickname ? e.nickname : e.sender.card

  const msg = await common.makeForwardMsg(e, forward, `${nickname}的${replacedMsg}占卜`)
  await e.reply(msg, false, { at : true })

  return true
}

export async function readAndParseJSON(filePath) {
    try {
        const fileContent = await fs.promises.readFile(path.join(__dirname, filePath), 'utf8')
        return JSON.parse(fileContent)
    } catch (e) {
        logger.info('[小可]json读取失败')
    }
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

    logger.info('[小可]图片url：'+imageUrl)
    return imageUrl
}