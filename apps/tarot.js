import fs from 'node:fs'
import lodash from 'lodash'
import chalk from "chalk"
import moment from 'moment'
import puppeteer from "puppeteer"
import plugin from '../../../lib/plugins/plugin.js'
import cards from '../data/tarot.js'
import YAML from 'yaml'
import { rulePrefix } from '../../StarRail-plugin/utils/common.js'
import { xkPath } from '#xk.path'

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
          reg: `^(#|${rulePrefix}|%)?塔罗牌$`,
          fnc: 'tarot'
        }
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
      return false;
    }

    await redis.incr(this.key)
    return true
  }

  async tarot (e) {
    const canAccess = await this.canAccessTarot()
    if (!canAccess) {
      return await this.reply('今天的占卜已达上限了哦，明天再来看看吧…')
    }
    const card = lodash.sample(cards)
const imageUrl = `https://gitee.com/logier/logier-plugin/raw/master/resources/%E5%A1%94%E7%BD%97%E7%89%8C/${card.type}/${card.pic}.webp`
    const options = [`正位: ${card.meaning.up}`, `逆位: ${card.meaning.down}`]
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
    <h2>${card.name_cn}</h2>
    <p>${card.name_en}</p>
    <div class="content" style="margin: 0 auto; padding: 12px 12px; height: 49rem; max-width: 980px; max-height: 1024px; background: rgba(255, 255, 255, 0.6); border-radius: 22px; backdrop-filter: blur(3px); box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3); writing-mode: vertical-rl; text-orientation: mixed;">
    <p style="font-size: 20px;">${meaning}</p>
    </div>
    <h2>${position}</h2>
    <br>
    <p>Create By 可歌岁月</p>
  </div>
  <div class="image" style="height:65rem; width: 65%; float: right; box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3); text-align: center; background:transparent;">
    <img src= "${imageUrl}" style="height: 100%; filter: brightness(100%); overflow: hidden; display: inline-block; vertical-align: middle; margin: 0; padding: 0;"/>
  </div>
</html> `
      await page.setContent(Html)
      const tarotimage = Buffer.from(await page.screenshot({ fullPage: true }))
      e.reply([`「${position}」${card.name_cn}(${card.name_en})\n回应是：${meaning}`,segment.image(tarotimage)], false, { at : true })
    } catch (error) {
      logger.error(error)
    } finally {
      if (browser) {
        await browser.close()
      }
    }
    return true
  }
}
