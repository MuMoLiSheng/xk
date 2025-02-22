import plugin from "../../../lib/plugins/plugin.js"
import lodash from "lodash"
import chalk from "chalk"
import { Common, Data } from "#xk"
import HelpTheme from "./help/HelpTheme.js"

export class help extends plugin {
  constructor() {
    super({
      name: `${chalk.rgb(255, 225, 255)(`[小可]可可帮助`)}`,
      dsc: '可可帮助',
      event: 'message',
      priority: -1314520,
      rule: [
        {
          reg: /^(\/|#|\*|%|~)?(原神|星铁|星布谷地|绝区零)?可可(命令|帮助|菜单|help|说明|功能|指令|使用说明)$/,
          fnc: 'help'
        },
      ]
    })
  }

  async help(e) {
    let custom = {}
    let help = {}

    let { diyCfg, sysCfg } = await Data.importCfg("help")

    custom = help

    let helpConfig = lodash.defaults(diyCfg.helpCfg || {}, custom.helpCfg, sysCfg.helpCfg)
    let helpList = diyCfg.helpList || custom.helpList || sysCfg.helpList
    let helpGroup = []

    lodash.forEach(helpList, (group) => {
      if (group.auth && group.auth === "master" && !e.isMaster) {
        return true
      }

      lodash.forEach(group.list, (help) => {
        let icon = help.icon * 1
        if (!icon) {
          help.css = "display:none"
        } else {
          let x = (icon - 1) % 10
          let y = (icon - x - 1) / 10
          help.css = `background-position:-${x * 50}px -${y * 50}px`
        }
      })

      helpGroup.push(group)
    })
    let themeData = await HelpTheme.getThemeData(diyCfg.helpCfg || {}, sysCfg.helpCfg || {})

    return await Common.render("help/index", {
      helpCfg: helpConfig,
      helpGroup,
      ...themeData,
      element: "default"
    }, { e, scale: 1 })
  }
}

// import Help from './help/Help.js'
// import chalk from "chalk"
// import { App } from '#xk'

// let app = App.init({
//   id: 'help',
//   name: `${chalk.rgb(255, 225, 255)(`[小可]可可帮助`)}`,
//   desc: '可可帮助'
// })

// app.reg({
//   help: {
//     rule: /^(\/|#)?(可可)?(命令|帮助|菜单|help|说明|功能|指令|使用说明)$/,
//     fn: Help.render,
//     desc: '【#/帮助】 #/可可帮助'
//   },
//   version: {
//     rule: /^(\/|#)?可可版本$/,
//     fn: Help.version,
//     desc: '【#/帮助】 #/可可版本介绍'
//   }
// })

// export default app
