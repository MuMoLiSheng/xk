import chalk from 'chalk'
import lodash from 'lodash'
import plugin from '../../../lib/plugins/plugin.js'

export class dice extends plugin {
  constructor () {
    super({
      name: `${chalk.rgb(255, 225, 255)(`[小可]roll骰子`)}`,
      dsc: 'roll骰子',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^#?roll ',
          fnc: 'roll'
        },
        {
          reg: '^#?r ',
          fnc: 'r'
        }
      ]
    })
  }

  async roll () {
    const choices = this.e.msg.split(' ').slice(1)
    const result = lodash.sample(choices)
    await this.reply(`bot帮你选择：${result}`, false, { at: true })
  }

  async r () {
    const range = this.e.msg.split(' ').map(Number).filter(Number.isInteger)
    const end = range.pop() ?? 100
    const start = range.pop() ?? 1
    const result = lodash.random(start, end)
    await this.reply(`在${start}和${end}间roll到了：${result}`)
  }
}
