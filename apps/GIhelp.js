import plugin from "../../../lib/plugins/plugin.js"
import lodash from "lodash"
import chalk from "chalk"
import { Common, Data } from "../components/index.js"
import HelpTheme from "./help/HelpTheme.js"

export class GIhelp extends plugin {
  constructor() {
    super({
      name: `${chalk.rgb(255, 225, 255)(`[小可]原神帮助`)}`,
      dsc: '原神帮助替代原生喵喵帮助',
      event: 'message',
      priority: -1314,
      rule: [
        {
          reg: /^(\/|#)?(原神)?(命令|帮助|菜单|help|说明|功能|指令|使用说明)$/,
          fnc: 'GIhelp'
        },
      ]
    })
  }

  async GIhelp(e) {
    let custom = {}
    let help = {}

    let { diyCfg, sysCfg } = await Data.importCfg("GIhelp")

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
