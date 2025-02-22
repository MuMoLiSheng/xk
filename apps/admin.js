import chalk from "chalk"
import lodash from 'lodash'
import { Cfg, Common, Data, Version } from '#xk'
import { exec } from 'child_process'
import makemsg from '../../../lib/common/common.js'
import { execSync } from 'child_process'
import { xkPath } from '#xk.path'

let keys = lodash.map(Cfg.getCfgSchemaMap(), (i) => i.key)
let sysCfgReg = new RegExp(`^#可可设置\\s*(${keys.join('|')})?\\s*(.*)$`)

export class Admin extends plugin {
  constructor() {
    super({
      name: `${chalk.rgb(255, 225, 255)(`[小可]可可设置`)}`,
      dsc: '可可设置',
      event: "message",
      priority: -1314520,
      rule: [
        {
          reg: '^#可可设置(.*)$',
          fnc: 'sysCfg'
        },
        {
          reg: '^#?可可(强制)?更新(.*)$',
          fnc: 'updatexkPlugin'
        },
        {
          reg: '^#?可可更新日志(.*)$',
          fnc: 'xkupdatelog'
        }
      ]
    })
  }
  async checkAuth (e) {
    if (!e.isMaster) {
      e.reply(`只有主人才能命令可可哦~
        (*/ω＼*)`)
      return false
    }
    return true
  }
  async sysCfg(e) {
    if (!await this.checkAuth(e)) {
      return true
    }
  
    let cfgReg = sysCfgReg
    let regRet = cfgReg.exec(e.msg)
    let cfgSchemaMap = Cfg.getCfgSchemaMap()

    if (!regRet) {
      return true
    }
  
    if (regRet[1]) {
      // 设置模式
      let val = regRet[2] || ''
  
      let cfgSchema = cfgSchemaMap[regRet[1]]
      if (cfgSchema.input) {
        val = cfgSchema.input(val)
      } else if (cfgSchema.type === 'str') {
        val = (val || cfgSchema.def) + ''
      } else {
        val = cfgSchema.type === 'num' ? (val * 1 || cfgSchema.def) : !/关闭/.test(val)
      }
      Cfg.set(cfgSchema.cfgKey, val)
    }

    let schema = Cfg.getCfgSchema()
    let cfg = Cfg.getCfg()

    // 渲染图像
    return await Common.render('admin/index', {
      schema,
      cfg,
      isMiao: Version.isMiao
    }, { e, scale: 1.4 })
  }

  async  updatexkPlugin (e) {
    let timer
    if (!await checkAuth(e)) {
      return true
    }
    let isForce = e.msg.includes('强制')
    let command = 'git  pull'
    if (isForce) {
      command = 'git  checkout . && git  pull'
      e.reply('正在执行强制更新操作，请稍等')
    } else {
      e.reply('正在执行更新操作，请稍等')
    }
    exec(command, { cwd: xkPath }, function (error, stdout, stderr) {
      if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
        e.reply('目前已经是最新版可可了~')
        return true
      }
      if (error) {
        e.reply('可可更新失败！\nError code: ' + error.code + '\n' + error.stack + '\n 请稍后重试。')
        return true
      }
      e.reply('可可更新成功，正在尝试重新启动Yunzai以应用更新...')
      timer && clearTimeout(timer)
      Data.setCacheJSON('xk:restart-msg', {
        msg: '重启成功，新版可可已经生效',
        qq: e.user_id
      }, 30)
      timer = setTimeout(function () {
        let command = 'npm run start'
        if (process.argv[1].includes('pm2')) {
          command = 'npm run restart'
        }
        exec(command, function (error, stdout, stderr) {
          if (error) {
            e.reply('自动重启失败，请手动重启以应用新版可可。\nError code: ' + error.code + '\n' + error.stack + '\n')
            Bot.logger.error(`重启失败\n${error.stack}`)
            return true
          } else if (stdout) {
            Bot.logger.mark('重启成功，运行已转为后台，查看日志请用命令：npm run log')
            Bot.logger.mark('停止后台运行命令：npm stop')
            process.exit()
          }
        })
      }, 1000)
    })
    return true
  }

  async xkupdatelog (e, plugin = 'xk') {
    let cm = 'git log  -20 --oneline --pretty=format:"%h||[%cd]  %s" --date=format:"%F %T"'
    if (plugin) {
      cm = `cd ./plugins/${plugin}/ && ${cm}`
    }
    let logAll
    try {
      logAll = await execSync(cm, { encoding: 'utf-8', windowsHide: true })
    } catch (error) {
      logger.error(error.toString())
      this.reply(error.toString())
    }
    if (!logAll) return false
    logAll = logAll.split('\n')
    let log = []
    for (let str of logAll) {
      str = str.split('||')
      if (str[0] == this.oldCommitId) break
      if (str[1].includes('Merge branch')) continue
      log.push(str[1])
    }
    let line = log.length
    log = log.join('\n\n')
    if (log.length <= 0) return ''
    let end = ''
    log = await makemsg.makeForwardMsg(this.e, [log, end], `${plugin}更新日志，共${line}条`)
    e.reply(log)
  }
}


// import lodash from 'lodash'
// import chalk from "chalk"
// import { exec } from 'child_process'
// import { Cfg, Common, Data, Version, App } from '#xk'
// import makemsg from '../../../lib/common/common.js'
// import { execSync } from 'child_process'
// import { xkPath } from '#xk.path'

// let keys = lodash.map(Cfg.getCfgSchemaMap(), (i) => i.key)
// let app = App.init({
//   id: 'admin',
//   name: `${chalk.rgb(255, 225, 255)(`[小可]可可设置`)}`,
//   desc: '可可设置'
// })

// let sysCfgReg = new RegExp(`^#可可设置\\s*(${keys.join('|')})?\\s*(.*)$`)

// app.reg({
//   update: {
//     rule: /^#可可(强制)?更新$/,
//     fn: updatexkPlugin,
//     desc: '【#管理】可可更新'
//   },
//   updatelog: {
//     rule: /^#可可更新日志$/,
//     fn: xkupdatelog,
//     desc: '【#管理】可可更新'
//   },
//   sysCfg: {
//     rule: sysCfgReg,
//     fn: sysCfg,
//     desc: '【#管理】系统设置'
//   },
// })

// export default app

// const checkAuth = async function (e) {
//   if (!e.isMaster) {
//     e.reply(`只有主人才能命令可可哦~
//     (*/ω＼*)`)
//     return false
//   }
//   return true
// }

// async function sysCfg (e) {
//   if (!await checkAuth(e)) {
//     return true
//   }

//   let cfgReg = sysCfgReg
//   let regRet = cfgReg.exec(e.msg)
//   let cfgSchemaMap = Cfg.getCfgSchemaMap()

//   if (!regRet) {
//     return true
//   }

//   if (regRet[1]) {
//     // 设置模式
//     let val = regRet[2] || ''

//     let cfgSchema = cfgSchemaMap[regRet[1]]
//     if (cfgSchema.input) {
//       val = cfgSchema.input(val)
//     } else if (cfgSchema.type === 'str') {
//       val = (val || cfgSchema.def) + ''
//     } else {
//       val = cfgSchema.type === 'num' ? (val * 1 || cfgSchema.def) : !/关闭/.test(val)
//     }
//     Cfg.set(cfgSchema.cfgKey, val)
//   }

//   let schema = Cfg.getCfgSchema()
//   let cfg = Cfg.getCfg()

//   // 渲染图像
//   return await Common.render('admin/index', {
//     schema,
//     cfg,
//     isMiao: Version.isMiao
//   }, { e, scale: 1.4 })
// }

// let timer

// async function updatexkPlugin (e) {
//   if (!await checkAuth(e)) {
//     return true
//   }
//   let isForce = e.msg.includes('强制')
//   let command = 'git  pull'
//   if (isForce) {
//     command = 'git  checkout . && git  pull'
//     e.reply('正在执行强制更新操作，请稍等')
//   } else {
//     e.reply('正在执行更新操作，请稍等')
//   }
//   exec(command, { cwd: xkPath }, function (error, stdout, stderr) {
//     if (/(Already up[ -]to[ -]date|已经是最新的)/.test(stdout)) {
//       e.reply('目前已经是最新版可可了~')
//       return true
//     }
//     if (error) {
//       e.reply('可可更新失败！\nError code: ' + error.code + '\n' + error.stack + '\n 请稍后重试。')
//       return true
//     }
//     e.reply('可可更新成功，正在尝试重新启动Yunzai以应用更新...')
//     timer && clearTimeout(timer)
//     Data.setCacheJSON('xk:restart-msg', {
//       msg: '重启成功，新版可可已经生效',
//       qq: e.user_id
//     }, 30)
//     timer = setTimeout(function () {
//       let command = 'npm run start'
//       if (process.argv[1].includes('pm2')) {
//         command = 'npm run restart'
//       }
//       exec(command, function (error, stdout, stderr) {
//         if (error) {
//           e.reply('自动重启失败，请手动重启以应用新版可可。\nError code: ' + error.code + '\n' + error.stack + '\n')
//           Bot.logger.error(`重启失败\n${error.stack}`)
//           return true
//         } else if (stdout) {
//           Bot.logger.mark('重启成功，运行已转为后台，查看日志请用命令：npm run log')
//           Bot.logger.mark('停止后台运行命令：npm stop')
//           process.exit()
//         }
//       })
//     }, 1000)
//   })
//   return true
// }

// async function xkupdatelog (e, plugin = 'xk') {
//   let cm = 'git log  -20 --oneline --pretty=format:"%h||[%cd]  %s" --date=format:"%F %T"'
//   if (plugin) {
//     cm = `cd ./plugins/${plugin}/ && ${cm}`
//   }
//   let logAll
//   try {
//     logAll = await execSync(cm, { encoding: 'utf-8', windowsHide: true })
//   } catch (error) {
//     logger.error(error.toString())
//     this.reply(error.toString())
//   }
//   if (!logAll) return false
//   logAll = logAll.split('\n')
//   let log = []
//   for (let str of logAll) {
//     str = str.split('||')
//     if (str[0] == this.oldCommitId) break
//     if (str[1].includes('Merge branch')) continue
//     log.push(str[1])
//   }
//   let line = log.length
//   log = log.join('\n\n')
//   if (log.length <= 0) return ''
//   let end = ''
//   log = await makemsg.makeForwardMsg(this.e, [log, end], `${plugin}更新日志，共${line}条`)
//   e.reply(log)
// }
