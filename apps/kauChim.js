import fs from 'fs'
import path from 'path'
import axios from 'axios'
import chalk from 'chalk'
import { dirname } from 'path'
import { xkPath } from '#xk.path'
import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import plugin from '../../../lib/plugins/plugin.js'
import { readAndParseJSON, getFunctionData, numToChinese, getImageUrl } from '../utils/getdate.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class kauChim extends plugin {
  constructor () {
    super({
      name: `${chalk.rgb(255, 225, 255)(`[小可]御神签`)}`,
      dsc: '御神签',
      event: 'message',
      priority: 5000, 
      rule: [
        {
          reg: `^((#|\\*|%)?(星铁)?)(抽签|求签|御神签|今日运势|运势)(\\s|$)$`,
          fnc: 'kauChim'
        },
        {
          reg: '^#?(悔签|重新抽取运势)$',
          fnc: 'regretkauChim'
        }
      ]
    })
  }

  async kauChim (e) {
    let jrys = await readAndParseJSON('../data/kauChim.json')
    let now = new Date().toLocaleDateString('zh-CN')
    let data = await redis.get(`Yunzai:xk:${e.user_id}_jrys`)
    let replymessage = '正在为你测算今日的运势……'
    if (data) {
      data = JSON.parse(data)
    } else {
      logger.info(`${chalk.rgb(255, 225, 255)(`[小可][御神签]未读取到运势数据，随机抽取`)}`)
      data = {
        fortune: jrys[Math.floor(Math.random() * jrys.length)],
        time: now,
        isRe: false
      }
    }
    if (now === data.time) {
      logger.info(`${chalk.rgb(255, 225, 255)(`[小可][御神签]今日已抽取运势，读取保存的数据`)}`)
      replymessage = '今日已抽取运势，让我帮你找找签……'
    } else {
      logger.info(`${chalk.rgb(255, 225, 255)(`[小可][御神签]日期已改变，重新抽取运势`)}`)
      data = {
        fortune: jrys[Math.floor(Math.random() * jrys.length)],
        time: now,
        isRe: false
      }
    }

    e.reply(replymessage, true, { recallMsg: 10 })
    await redis.set(`Yunzai:xk:${e.user_id}_jrys`, JSON.stringify(data))
    await generateFortune(e)
    return true
  }

  async regretkauChim (e) {
    let jrys = await readAndParseJSON('../data/kauChim.json')
    let now = new Date().toLocaleDateString('zh-CN')
    let data = await redis.get(`Yunzai:xk:${e.user_id}_jrys`)
    let replymessage = '正在为你测算今日悔签后的运势……'
    if (data) {
      data = JSON.parse(data)
    } else {
      logger.info(`${chalk.rgb(255, 225, 255)(`[小可][御神签]未读取到运势数据，悔签转为重新抽取运势`)}`)
      data = {
        fortune: jrys[Math.floor(Math.random() * jrys.length)],
        time: now,
        isRe: false
      }
    }
    if (now !== data.time) {
      logger.info(`${chalk.rgb(255, 225, 255)(`[小可][御神签]日期变更，重新抽取运势`)}`)
      data = {
        fortune: jrys[Math.floor(Math.random() * jrys.length)],
        time: now,
        isRe: false
      }
    } else if (data.isRe) {
      logger.info(`${chalk.rgb(255, 225, 255)(`[小可][御神签]今日已悔签，不重新抽取`)}`)
      replymessage = '今天已经悔过签啦,再给你看一眼吧……'
    } else {
      logger.info(`${chalk.rgb(255, 225, 255)(`[小可][御神签]悔签`)}`)
      replymessage = '异象骤生，运势竟然改变了……'
      data = {
        fortune: jrys[Math.floor(Math.random() * jrys.length)],
        time: now,
        isRe: true
      }
    }
    e.reply(replymessage, true, { recallMsg: 10 })
    await redis.set(`Yunzai:xk:${e.user_id}_jrys`, JSON.stringify(data))
    await generateFortune(e)
    return true
  }

  // async kauChim (e) {
  //   const card = lodash.sample(cards)
  //   const currentDate = new Date()
  //   const year = currentDate.getFullYear()
  //   const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
  //   const day = currentDate.getDate().toString().padStart(2, '0')
  //   const date_time = `${year}-${month}-${day}`
  //   let date_time2 = await redis.get(`Yunzai:meiridaka3qn:${e.user_id}_dakapro`);date_time2 = JSON.parse(date_time2)
  //   const zhi = await redis.get(`Yunzai:meiridakazhi:${e.user_id}_dakapro`)
  //   let qian = await redis.get(`Yunzai:meiridakaqian:${e.user_id}_dakapro`);qian = JSON.parse(qian)
  //   if (date_time === date_time2) {
  //       e.reply(`你今天已经抽过签了，我来帮你找找看……\n签是：【`+qian+`】\n可别再忘掉哦~`, false , { at: true })
  //       return true
  //     }
  //     e.reply(`让我看看……\n你抽到的签：\n【${card.name ? `${card.name}` : ``}】${card.luckyStar ? `\n${card.luckyStar}` : ``}${card.dsc ? `\n${card.dsc}` : ``}${card.unsignText ? `\n${card.unsignText}` : ``}${card.item ? `\n${card.item}` : ``}`, false , { at: true })
  //   redis.set(`Yunzai:meiridaka3qn:${e.user_id}_dakapro`, JSON.stringify(date_time))
  //   redis.set(`Yunzai:meiridakaqian:${e.user_id}_dakapro`, JSON.stringify(card.name))
  //   return true
  // }
}

async function generateFortune (e) {
  const UrlsConfig = getFunctionData('kauChim', 'kauChim', 'Urls', '今日运势')
  const imageUrl = await getImageUrl(UrlsConfig.imageUrls)
  let nickname = e.nickname ? e.nickname : e.sender.card
  let data = await redis.get(`Yunzai:xk:${e.user_id}_jrys`)
  const fortune = JSON.parse(data).fortune
  const isReData = JSON.parse(data)
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
    <div class="fortune" style="width: 30%; height: 65rem; float: left; text-align: center; background: rgba(255, 255, 255, 0.6);">
      <p>${nickname}的${await numToChinese(new Date().getDate())}号运势为</p>
      <h2>${fortune.fortuneSummary}</h2>
      <p>${fortune.luckyStar}</p>
      <div class="content" style="margin: 0 auto; padding: 12px 12px; height: 49rem; max-width: 980px; max-height: 1024px; background: rgba(255, 255, 255, 0.6); border-radius: 15px; backdrop-filter: blur(3px); box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3); writing-mode: vertical-lr; text-orientation: mixed;">
        <p >${fortune.signText}</p>
        <p >${fortune.unsignText}</p>
      </div>
      <p>${isReData.isRe === false ? '今日还可以悔签1次': '今日已悔签'}</p>
      <p>| 相信科学，请勿迷信 |</p>
      <p>Create By 可歌岁月 </p>
    </div>
    <div class="image" style="height:65rem; width: 70%; float: right; box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3); text-align: center;">
      <img src=${imageUrl} style="height: 100%; filter: brightness(100%); overflow: hidden; display: inline-block; vertical-align: middle; margin: 0; padding: 0;"/>
    </div>
  </html>`
  let browser
  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    await page.setContent(Html)
    const image = Buffer.from(await page.screenshot({ fullPage: true }))
    e.reply([segment.at(e.user_id),`的${await numToChinese(new Date().getDate())}号运势为……\n${fortune.fortuneSummary}\n${fortune.luckyStar}\n${fortune.signText}\n${fortune.unsignText}`,segment.image(image)])
  } catch (error) {
    logger.error(`${chalk.rgb(240, 75, 60)(`[小可][御神签]图片渲染失败，使用文本发送`)}`)
    e.reply([segment.at(e.user_id), `的${await numToChinese(new Date().getDate())}号运势为……\n${fortune.fortuneSummary}\n${fortune.luckyStar}\n${fortune.signText}\n${fortune.unsignText}\n\n图片渲染失败，若一直出现无图请联系管理员`])
  } finally {
    if (browser) {
      await browser.close()
    }
  }

  // 下载图片并保存到本地
  async function downloadImage(imageUrl, savePath) {
    try {
      const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream'
      })

      const writer = fs.createWriteStream(savePath)

      response.data.pipe(writer)

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
    } catch (error) {
      console.error(`${chalk.rgb(240, 75, 60)(`[小可][御神签]下载图片失败：`)}`, error)
      throw error
    }
  }
  // 创建保存路径
  const saveDir = path.join(`${xkPath}/data/images`)
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true })
  }
  const savePath = path.join(saveDir, `${Date.now()}.png`) // 使用时间戳命名

  try {
    // 下载并保存图片
    await downloadImage(imageUrl, savePath)
    console.log(`${chalk.rgb(255, 225, 255)(`[小可][御神签]图片已保存到：${savePath}`)}`)
    // 自动删除图片
    const deleteAfter = 3 * 60 * 60 * 1000 // 3小时后的毫秒数
    setTimeout(() => {
      fs.unlink(savePath, (err) => {
        if (err) {
          console.error(`${chalk.rgb(240, 75, 60)(`[小可][御神签]删除图片失败：${savePath}`)}`, err)
        } else {
          console.log(`${chalk.rgb(255, 225, 255)(`[小可][御神签]图片已删除：${savePath}`)}`)
        }
      })
    }, deleteAfter)
  } catch (error) {
    console.error(`${chalk.rgb(240, 75, 60)(`[小可][御神签]保存图片失败：`)})`, error)
  }
}
