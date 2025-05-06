import fs from "node:fs"
import chalk from "chalk"
import lodash from "lodash"
import { ALL } from "node:dns"
import setting from "../models/setting.js"
import common from "../../../lib/common/common.js"
import plugin from "../../../lib/plugins/plugin.js"

/** 主人（Master）
 * @param {*} Master - 主人和云梦QQ号
 * @description
 * 需自行添加后重启
 */
let Master = []
/** 各群群管理员（admin）
 * @param {*} admin - 各群群管理QQ号
 * @description
 * 需自行添加后重启
 */
let admin = []

let textArr = {}
let gmSetFile = "./plugins/xk/config/gm.set.yaml"
if (!fs.existsSync(gmSetFile)) {
  fs.copyFileSync("./plugins/xk/defSet/gm/set.yaml", gmSetFile)
}

export class gm extends plugin {
  constructor() {
    super({
      name: `${chalk.rgb(255, 225, 255)(`[小可]快捷群管`)}`,
      dsc: "可可·快捷群管",
      event: "message",
      priority: -1314520,
      rule: [
        {
          reg: "^(戳|撤|禁|踢)+\\s*[0-9]*$",
          fnc: "shortcuts",
        }
      ],
    })
    this.path = "./data/shortcutsJson/"
    /** 读取群管相关设置数据 */
    this.gmSetData = setting.getConfig("gm", "set")
  }

  async init() {
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path)
    }
  }

  async accept() {
    if (!this.e.message) return false
    if (!this.e.isGroup) return false
    await this.getGroupId()
    if (!this.group_id) return false
    this.initTextArr()
    let keyword = this.getKeyWord(this.e)
    // 检查是否@了用户
    let atUser = this.checkAtUser(this.e.message.text)
    let msg = textArr[this.group_id].get(keyword) || ""
    const time = msg.replace(/(戳|撤|禁|踢)+\s*/g, "") || 0
    if (lodash.isEmpty(msg)) return false
    let uid = this.e.source.user_id
    if (atUser && (this.e.group.is_admin || this.e.isMaster)) {
      this.executeAction(msg, atUser)
    } else if (this.e.group.is_admin) {
      if (msg && msg.indexOf("禁") !== -1) {
        if (!Master.includes(uid) && !admin.includes(uid) && uid != this.e.sender.user_id || this.e.isMaster) {
        let duration = Math.floor(Math.random() * 600) + 1
        if (time) {
          duration = time * 60
        }
        this.e.group.muteMember(this.e.sender.user_id, duration)
      }
      } else if (msg && msg.indexOf("踢") !== -1 && this.e.isMaster) {
        setTimeout(async () => {
          this.e.group.recallMsg(this.e.seq)
          await common.sleep(600)
          this.e.group.kickMember(this.e.sender.user_id)
          await this.addOutGroupBlack(this.e.sender.user_id)
        }, time * 1000)
      } else if (msg && msg.indexOf("撤") !== -1) {
        setTimeout(
          () => this.e.group.recallMsg(this.e.seq, this.e.rand),
          time * 1000
        )
      }
    } else if (msg.indexOf("撤") !== -1) {
        setTimeout(
          () => this.e.group.recallMsg(this.e.seq, this.e.rand),
          time * 1000
        )
      }
    if (msg.indexOf("戳") !== -1) {
      setTimeout(
        () => this.e.group.pokeMember(this.e.sender.user_id),
        time * 1000
      )
    }
  }

  // 新增方法，检查消息中是否@了用户
  checkAtUser(message) {
    // 确保message是字符串
    if (typeof message === 'string') {
      const atRegex = /@[1-9][0-9]{4,14}/g // @用户的正则表达式
      const matches = message.match(atRegex) // 匹配消息中的@用户
      return matches ? matches.map(match => match.replace('@', '')) : null // 返回用户ID数组
    } else if (typeof message === 'object' && message.text) {
      // 如果message是对象，尝试获取message.text
      return this.checkAtUser(message.text)
    }
  }
  
  /**
   * 执行禁言等操作。
   * @param {string} msg - 操作消息
   * @param {array} userIds - 用户ID数组
   */
  // 新增方法，执行禁言等操作
  executeAction(msg, userIds) {
    userIds.forEach(userId => {
      if (msg.indexOf("禁") !== -1) {
        // let duration = Math.floor(Math.random() * 600) + 1
        // this.e.group.muteMember(userId, duration)
      } else if (msg.indexOf("踢") !== -1 && this.e.isMaster) {
        // setTimeout(async () => {
          // this.e.group.kickMember(userId)
          // await this.addOutGroupBlack(userId)
        // }, time * 1000)
      } else if (msg.indexOf("撤") !== -1) {
        // setTimeout(() => this.e.group.recallMsg(this.e.seq, this.e.rand), time * 1000)
      } else if (msg.indexOf("戳") !== -1) {
        // setTimeout(() => this.e.group.pokeMember(this.e.user_id), time * 1000)
      }
    })
  }

  /** 群号key */
  get grpKey() {
    return `Yz:xxgm_group_id:${this.e.user_id}`
  }

  async shortcuts() {
    if (!this.checkAuth()) return
    await this.getGroupId()

    if (!this.group_id) {
      this.e.reply("请先在群内触发该指令")
      return
    }

    if (this.e.source) {
      let msg = (await this.e.group.getChatHistory(this.e.source.seq, 1)).pop()
      let uid = this.e.source.user_id
      const time = this.e.msg.replace(/(戳|撤|禁|踢|禁撤)+\s*/g, "") || 0
      if (this.e.group.is_admin) {
        if (this.e.msg.indexOf("禁撤") !== -1) {
          if (!Master.includes(uid) && !admin.includes(uid) && uid != this.e.sender.user_id || this.e.isMaster) {
          this.e.group.recallMsg(this.e.source.seq)
          await common.sleep(600)
          let duration = Math.floor(Math.random() * 600) + 1
          if (time) { duration = time }
          let days = Math.floor(duration / (24 * 60 * 60))
          let hours = Math.floor((duration % (24 * 60 * 60)) / 3600)
          let minutes = Math.floor((duration % 3600) / 60)
          let seconds = duration % 60
          let durationStr = days >= 30 ? `最多只能是30天00小时00分00秒` : seconds < 60 && days === 0 && hours === 0 && minutes === 0 ? `最少只能是01分钟00秒` : `${days ? `${days}天` : ''}${hours ? `${hours}小时` : ''}${minutes ? `${minutes}分钟` : ''}${seconds ? `${seconds}秒` : ''}`
          this.e.group.muteMember(this.e.source.user_id, duration)
          this.e.reply([segment.at(this.e.source.user_id),`\n✅ 你被${this.e.nickname}禁言+撤回此消息，${duration = time ? `指定的时长为：${durationStr}。` : `未指定禁言时长，将自动在1-10分钟内随机生成禁言时长，\n随机到的禁言时长为：${durationStr}。` }`])
          } else if (!Master.includes(uid) && !admin.includes(uid)) {
            this.e.reply([segment.at(uid), `❎ 该命令仅限管理可用。`])
          } else if (Master.includes(uid)) {
            this.e.reply([segment.at(this.e.sender.user_id),`❎ 你无权禁言云梦以及她的主人以及撤回她的消息。`])
          } else if (admin.includes(uid)) {
            this.e.reply([segment.at(this.e.sender.user_id),`❎ 你无权禁言群管理员以及撤回她的消息。`])
          } else if (uid == this.e.sender.user_id) {
            this.e.reply([segment.at(uid),`❎ 你无权禁言自己以及撤回自己的消息。`])
          }
        } else if (this.e.msg.indexOf("禁") !== -1) {
        if (!Master.includes(uid) && !admin.includes(uid) && uid != this.e.sender.user_id || this.e.isMaster) {
          let duration = Math.floor(Math.random() * 600) + 1
          if (time) { duration = time }
          let days = Math.floor(duration / (24 * 60 * 60))
          let hours = Math.floor((duration % (24 * 60 * 60)) / 3600)
          let minutes = Math.floor((duration % 3600) / 60)
          let seconds = duration % 60
          let durationStr = days >= 30 ? `最多只能是30天00小时00分00秒` : seconds < 60 && days === 0 && hours === 0 && minutes === 0 ? `最少只能是01分钟00秒` : `${days ? `${days}天` : ''}${hours ? `${hours}小时` : ''}${minutes ? `${minutes}分钟` : ''}${seconds ? `${seconds}秒` : ''}`
          this.e.group.muteMember(this.e.source.user_id, duration)
          this.e.reply([segment.at(this.e.source.user_id),`\n✅ 你被${this.e.nickname}禁言，${duration = time ? `指定的时长为：${durationStr}。` : `未指定禁言时长，将自动在1-10分钟内随机生成禁言时长，\n随机到的禁言时长为：${durationStr}。` }`])
          } else if (!Master.includes(uid) && !admin.includes(uid)) {
            this.e.reply([segment.at(uid), `❎ 该命令仅限管理可用。`])
          } else if (Master.includes(uid)) {
            this.e.reply([segment.at(this.e.sender.user_id),`❎ 你无权禁言云梦以及她的主人。`])
          } else if (uid === 3224023700) {
            let duration = Math.floor(Math.random() * 600) + 1
            if (time) { duration = time }
            let days = Math.floor(duration / (24 * 60 * 60))
            let hours = Math.floor((duration % (24 * 60 * 60)) / 3600)
            let minutes = Math.floor((duration % 3600) / 60)
            let seconds = duration % 60
            let durationStr = days >= 30 ? `最多只能是30天00小时00分00秒` : seconds < 60 && days === 0 && hours === 0 && minutes === 0 ? `最少只能是01分钟00秒` : `${days ? `${days}天` : ''}${hours ? `${hours}小时` : ''}${minutes ? `${minutes}分钟` : ''}${seconds ? `${seconds}秒` : ''}`
            this.e.group.muteMember(this.e.source.user_id, duration)
            this.e.reply([segment.at(this.e.source.user_id),`\n${this.e.nickname}被禁言，${duration = time ? `指定的时长为：${durationStr}。` : `未指定禁言时长，将自动在1-10分钟内随机生成禁言时长，\n随机到的禁言时长为：${durationStr}。` }`])
          } else if (admin.includes(uid)) {
            this.e.reply([segment.at(this.e.sender.user_id),`❎ 你无权禁言群管理员。`])
          } else if (uid == this.e.sender.user_id) {
            this.e.reply([segment.at(uid),`❎ 你无权禁言你自己。`])
          }
        } else if (this.e.msg.indexOf("踢") !== -1 && this.e.isMaster) {
            setTimeout(async () => {
              this.e.group.recallMsg(this.e.source.seq)
              await common.sleep(600)
              this.e.group.kickMember(this.e.source.user_id)
              await this.addOutGroupBlack(this.e.source.user_id)
            }, time * 1000)
        } else if (this.e.msg.indexOf("撤") !== -1) {
          setTimeout(
            () => this.e.group.recallMsg(this.e.source.seq, this.e.source.rand),
            time * 1000
          )
          this.e.reply(`✅ 已将对应消息撤回。`,true)
        }
      } else {
        if (this.e.msg.indexOf("撤") !== -1 && this.e.source.user_id == Bot.uin) {
          setTimeout(
            () => this.e.group.recallMsg(this.e.source.seq, this.e.source.rand),
            time * 1000
          )
          this.e.reply(`✅ 已将对应消息撤回。`,true)
        }
        this.e.reply(`❎ 格式错误，请回复对应消息并发送 撤|禁|禁撤|踢 以进行对应操作。`,true, { at: true })
      }
      if (this.e.msg.indexOf("戳") !== -1) {
        setTimeout(
          () => this.e.group.pokeMember(this.e.source.user_id),
          time * 1000
        )
      }
    }
  }

  checkAuth() {
    if (this.e.isMaster) return true

    if (
      this.gmSetData.shortcutsPermission == "owner" &&
      (this.e.member.is_owner || this.e.isMaster)
    ) {
      return true
    }

    if (
      this.gmSetData.shortcutsPermission == "admin" &&
      (this.e.member.is_owner || this.e.isMaster || this.e.member.is_admin || ALL)
    ) {
      return true
    }

    return false
  }

  async makeForwardMsg(qq, title, msg, end = "") {
    let nickname = Bot.nickname
    if (this.e.isGroup) {
      let info = await Bot.getGroupMemberInfo(this.e.group_id, qq)
      nickname = info.card ?? info.nickname
    }
    let userInfo = {
      user_id: Bot.uin,
      nickname,
    }

    let forwardMsg = [
      {
        ...userInfo,
        message: title,
      },
    ]

    let msgArr = lodash.chunk(msg, 40)
    msgArr.forEach((v) => {
      v[v.length - 1] = lodash.trim(v[v.length - 1], "\n")
      forwardMsg.push({ ...userInfo, message: v })
    })

    if (end) {
      forwardMsg.push({ ...userInfo, message: end })
    }

    /** 制作转发内容 */
    if (this.e.isGroup) {
      forwardMsg = await this.e.group.makeForwardMsg(forwardMsg)
    } else {
      forwardMsg = await this.e.friend.makeForwardMsg(forwardMsg)
    }

    /** 处理描述 */
    forwardMsg.data = forwardMsg.data
      .replace(/\n/g, "")
      .replace(/<title color="#777777" size="26">(.+?)<\/title>/g, "___")
      .replace(/___+/, `<title color="#777777" size="26">${title}</title>`)

    return forwardMsg
  }

  /** 分页 */
  pagination(pageNo, pageSize, array) {
    let offset = (pageNo - 1) * pageSize
    return offset + pageSize >= array.length
      ? array.slice(offset, array.length)
      : array.slice(offset, offset + pageSize)
  }

  /** 关键词转换成可发送消息 */
  async keyWordTran(msg) {
    /** 图片 */
    if (msg.includes("{image")) {
      let tmp = msg.split("{image")
      if (tmp.length > 2) return false

      let md5 = tmp[1].replace(/}|_|:/g, "")

      msg = segment.image(`http://gchat.qpic.cn/gchatpic_new/0/0-0-${md5}/0`)
      msg.asface = true
    } else if (msg.includes("{at:")) {
      let tmp = msg.match(/{at:(.+?)}/g)

      for (let qq of tmp) {
        qq = qq.match(/[1-9][0-9]{4,14}/g)[0]
        let member = await await Bot.getGroupMemberInfo(
          this.group_id,
          Number(qq)
        ).catch(() => {})
        let name = member?.card ?? member?.nickname
        if (!name) continue
        msg = msg.replace(`{at:${qq}}`, `@${name}`)
      }
    } else if (msg.includes("{face")) {
      let tmp = msg.match(/{face(:|_)(.+?)}/g)
      if (!tmp) return msg
      msg = []
      for (let face of tmp) {
        let id = face.match(/\d+/g)
        msg.push(segment.face(id))
      }
    }

    return msg
  }

  async addOutGroupBlack(user_id) {
    let blackkey = `Yz:newblackcomers:${this.e.group_id}`

    let blackcomers = await redis.get(blackkey)

    const { blacks = [] } = blackcomers ? JSON.parse(blackcomers) : {}

    let blackcomersSet = new Set(blacks)

    blackcomersSet.add(user_id)

    await redis.set(
      blackkey,
      JSON.stringify({ blacks: Array.from(blackcomersSet) })
    )
  }

  saveJson() {
    let obj = {}
    for (let [k, v] of textArr[this.group_id]) {
      obj[k] = v
    }

    fs.writeFileSync(
      `${this.path}${this.group_id}.json`,
      JSON.stringify(obj, "", "\t")
    )
  }

  /** 初始化已添加内容 */
  initTextArr() {
    if (textArr[this.group_id]) return

    textArr[this.group_id] = new Map()

    let path = `${this.path}${this.group_id}.json`
    if (!fs.existsSync(path)) {
      return
    }

    try {
      let text = JSON.parse(fs.readFileSync(path, "utf8"))

      for (let i in text) {
        textArr[this.group_id].set(String(i), text[i])
      }
    } catch (error) {
      logger.error(`json格式错误：${path}`)
      delete textArr[this.group_id]
      return false
    }
  }

  /** 获取添加关键词 */
  getKeyWord(msg) {
    return (
      msg
        .toString()
        .trim()
        /** 过滤@ */
        .replace(new RegExp("{at:" + Bot.uin + "}", "g"), "")
        .trim()
    )
  }

  /** 获取群号 */
  async getGroupId() {
    if (this.e.isGroup) {
      this.group_id = this.e.group_id
      redis.setEx(this.grpKey, 3600 * 24 * 30, String(this.group_id))
      return this.group_id
    }
    // redis获取
    let groupId = await redis.get(this.grpKey)
    if (groupId) {
      this.group_id = groupId
      return this.group_id
    }
    return false
  }
}
