import lodash from 'lodash'
import chalk from "chalk"
import plugin from '../../../lib/plugins/plugin.js'
import cards from '../data/kauChim.js'
import { rulePrefix } from '../../StarRail-plugin/utils/common.js'

export class kauChim extends plugin {
  constructor () {
    super({
      name: `${chalk.rgb(255, 225, 255)(`[小可]御神签`)}`,
      dsc: '御神签',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: `^(#|${rulePrefix}|%)?(抽签|求签|御神签|今日运势|运势)(\\s|$)$`,
          fnc: 'kauChim'
        }
      ]
    })
    this.prefix = 'L:other:kauChim:'
  }

  async kauChim (e) {
    const card = lodash.sample(cards)
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
    const day = currentDate.getDate().toString().padStart(2, '0')
    const date_time = `${year}-${month}-${day}`
    let date_time2 = await redis.get(`Yunzai:meiridaka3qn:${e.user_id}_dakapro`);date_time2 = JSON.parse(date_time2)
    const zhi = await redis.get(`Yunzai:meiridakazhi:${e.user_id}_dakapro`)
    let qian = await redis.get(`Yunzai:meiridakaqian:${e.user_id}_dakapro`);qian = JSON.parse(qian)
    if (date_time === date_time2) {
        e.reply(`你今天已经抽过签了，我来帮你找找看……\n签是：【`+qian+`】\n可别再忘掉哦~`, false , { at: true })
        return true
      }
      e.reply(`让我看看……\n你抽到的签：\n【${card.name ? `${card.name}` : ``}】${card.luckyStar ? `\n${card.luckyStar}` : ``}${card.dsc ? `\n${card.dsc}` : ``}${card.unsignText ? `\n${card.unsignText}` : ``}${card.item ? `\n${card.item}` : ``}`, false , { at: true })
    redis.set(`Yunzai:meiridaka3qn:${e.user_id}_dakapro`, JSON.stringify(date_time))
    redis.set(`Yunzai:meiridakaqian:${e.user_id}_dakapro`, JSON.stringify(card.name))
    return true
  }
}
