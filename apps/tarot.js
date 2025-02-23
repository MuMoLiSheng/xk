import YAML from 'yaml'
import fs from 'node:fs'
import chalk from 'chalk'
import lodash from 'lodash'
import moment from 'moment'
import { xkPath } from '#xk.path'
import puppeteer from 'puppeteer'
import cards from '../data/tarot.js'
import common from '../../../lib/common/common.js' 
import plugin from '../../../lib/plugins/plugin.js'
import { readAndParseJSON } from '../utils/getdate.js'

const _path = process.cwd()
const tarotsPath = `${xkPath}/data/tarot/`

let limit

export class tarot extends plugin {
  constructor () {
    super({
      name: `${chalk.rgb(255, 225, 255)(`[小可]塔罗牌`)}`,
      dsc: '塔罗牌',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: `^((#|\\*|%)?(星铁)?)(塔罗牌|塔罗)(.*)$`,
          fnc: 'tarot'
      },
      {
        reg: '^((#|\\*|%)?(星铁)?)(占卜)(.*)$',
        fnc: 'divination'
      },
      ]
    })
    this.file = `${xkPath}/data/tarotConfig.yaml`
    this.prefix = 'L:other:tarot:'
  }

  async init () {
    if (!fs.existsSync(this.file)) {
      fs.writeFileSync(this.file, `limit: 5`)
    }
    const limitConfigStr = fs.readFileSync(this.file, 'utf8')
    const limitConfig = YAML.parse(limitConfigStr).limit
    limit = Math.max(parseInt(limitConfig) || 1, 1)
  }

  get key () {
    /** 群，私聊分开 */
    if (this.e.isGroup) {
      return `${this.prefix}${this.e.group_id}:${this.e.user_id}`
    } else {
      return `${this.prefix}private:${this.e.user_id}`
    }
  }

  async canAccessTarot() {
    const counterValue = await redis.get(this.key)
    if (counterValue === null) {
      const endOfDay = moment().endOf('day')
      const remainingSeconds = endOfDay.diff(moment(), 'seconds')
      try {
        await redis.setEx(this.key, remainingSeconds, '1')
      } catch (err) {
        console.log(err)
      }
      return true
    }

    console.log(counterValue, typeof counterValue)

    if (parseInt(counterValue) >= limit) {
      return false
    }

    await redis.incr(this.key)
    return true
  }

  async tarot(e) {
    const canAccess = await this.canAccessTarot()
    if (!canAccess) {
      return await this.reply('今天的占卜已达上限了哦，明天再来看看吧…')
    } else {
      await DrawTarotCards(e)
      return true
    }
  }

  async divination(e) {
    const canAccess = await this.canAccessTarot()
    if (!canAccess) {
      return await this.reply('今天的占卜已达上限了哦，明天再来看看吧…')
    } else {
      await FortuneTellingTarotCards(e)
      return true
    }
  }
//   async tarot (e) {
//     const canAccess = await this.canAccessTarot()
//     if (!canAccess) {
//       return await this.reply('今天的占卜已达上限了哦，明天再来看看吧…')
//     }
//     const card = lodash.sample(cards)
//     const imageUrl = `https://gitee.com/Mu_Ling_Er/xk/raw/master/data/tarot/${card.type}/${card.pic}.webp`
//     const options = [`正位: ${card.meaning.up}`, `逆位: ${card.meaning.down}`]
//     const selection = options[Math.floor(Math.random() * options.length)]
//     let [position, meaning] = selection.split(': ')
//     let browser
//     try {
//       browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
//       const page = await browser.newPage()
  
//     let Html = `
//   <html style="background: rgba(255, 255, 255, 0.6)">
//   <head>
//     <style>
//     html, body {
//         margin: 0;
//         padding: 0;
//         font-family: '华康方圆体W7(P)', "华康方圆体W7(P)", '华康方圆体W7(P)', "华康方圆体W7(P)", '华康方圆体W7(P)', "华康方圆体W7(P)", "华康方圆体W7(P)", sans-serif;
//     }         
//     </style>
//   </head>
//   <div class="fortune" style="width: 35%; height: 65rem; float: left; text-align: center; background: rgba(255, 255, 255, 0.6);">
//     <h2>${card.name_cn}</h2>
//     <p>${card.name_en}</p>
//     <div class="content" style="margin: 0 auto; padding: 12px 12px; height: 49rem; max-width: 980px; max-height: 1024px; background: rgba(255, 255, 255, 0.6); border-radius: 22px; backdrop-filter: blur(3px); box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3); writing-mode: vertical-rl; text-orientation: mixed;">
//     <p style="font-size: 20px;">${position === '正位' ? card.description.updescription : card.description.downdescription}</p>
//     </div>
//     <h2>「${position}」${meaning}</h2>
//     <br>
//     <p>Create By 可歌岁月</p>
//   </div>
//   <div class="image" style="height:65rem; width: 65%; float: right; box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3); text-align: center; background:transparent;">
//     <img src= "${imageUrl}" style="height: 100%; filter: brightness(100%); overflow: hidden; display: inline-block; vertical-align: middle; margin: 0; padding: 0;"/>
//   </div>
// </html> `
//       await page.setContent(Html)
//       const tarotimage = Buffer.from(await page.screenshot({ fullPage: true }))
//       e.reply([`「${position}」${card.name_cn}(${card.name_en})\n卡牌回应：${meaning}\n卡牌描述：${position === '正位' ? card.description.updescription : card.description.downdescription}`,segment.image(tarotimage)], false, { at : true })
//     } catch (error) {
//      logger.error(`${chalk.rgb(240, 75, 60)(`[小可][塔罗牌]` + error)}`)
//     } finally {
//       if (browser) {
//         await browser.close()
//       }
//     }
//     return true
//   }
}

const tarotData = await readAndParseJSON(`../data/tarot.json`)

async function DrawTarotCards(e) {
  // 获取所有塔罗牌的键并随机选择一张塔罗牌
  const keys = Object.keys(tarotData.cards)
  const randomKey = keys[Math.floor(Math.random() * keys.length)]
  const randomCard = tarotData.cards[randomKey]

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
</html>`
    await page.setContent(Html)
    const tarotimage = Buffer.from(await page.screenshot({ fullPage: true }))
    e.reply([`「${position}」${randomCard.name_cn} (${randomCard.name_en})\n卡牌回应：${meaning}\n卡牌描述：${position === '正位' ? randomCard.info.description : randomCard.info.reverseDescription}`,segment.image(tarotimage)], false, { at : true })
  } catch (error) {
    logger.error(`${chalk.rgb(240, 75, 60)(`[小可][塔罗牌]` + error)}`)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
  return true
}

async function FortuneTellingTarotCards(e, replacedMsg = '') {
  const forward = ["正在为您抽牌……"]
  const keys = Object.keys(tarotData.cards)
  const randomCards = []
  const cardPositions = []
  for(let i = 0; i < 3; i++) {
    let randomCard
    do {
      const randomIndex = Math.floor(Math.random() * keys.length)
      const randomKey = keys[randomIndex]
      randomCard = tarotData.cards[randomKey]
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
