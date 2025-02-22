import { Data, Version } from '../components/index.js'
import fs from 'node:fs'
import Trans from './trans.js'
import { rootPath } from './path.js'

let relpyPrivate = async function () {
}
let common = await Data.importModule('lib/common/common.js', 'root')
if (common && common.default && common.default.relpyPrivate) {
  relpyPrivate = common.default.relpyPrivate
}

const Index = {
  async init () {
    await Index.checkVersion()
    await Index.startMsg()
    Index.transUserData()
  },

  // 发启动消息
  async startMsg () {
    let msgStr = await redis.get('xk:restart-msg')
    if (msgStr) {
      let msg = JSON.parse(msgStr)
      await relpyPrivate(msg.qq, msg.msg)
      await redis.del('xk:restart-msg')
      let msgs = [`当前可可版本: ${Version.version}`, '您可使用 #可可版本 命令查看更新信息']
      await relpyPrivate(msg.qq, msgs.join('\n'))
    }
  },

  // 检查版本
  async checkVersion () {
    if (!Version.isV3 && !Version.isAlemonjs) {
      console.log('警告：xk需要V3 Yunzai，请升级至最新版xk-Yunzai以使用xk')
    }
    if (!fs.existsSync(rootPath + '/lib/plugins/runtime.js')) {
      let msg = '警告：未检测到runtime，xk可能无法正常工作。请升级至最新版xk-Yunzai以使用xk'
      if (!await redis.get('xk:runtime-warning')) {
        await relpyPrivate(msg.qq, msg)
        await redis.set('xk:runtime-warning', 'true', { EX: 3600 * 24 })
      } else {
        console.log(msg)
      }
    }
  },

  // 迁移面板数据
  transUserData () {
    Trans.init()
  }
}
export default Index
