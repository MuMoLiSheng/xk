import lodash from 'lodash'
import { Common, Data } from '../../../miao-plugin/components/index.js'
import { Button, ProfileRank, Player, Character } from '../../../miao-plugin/models/index.js'
import { getTargetUid } from '../../../miao-plugin/apps/profile/ProfileCommon.js'

const ProfileList = {
  /**
   * 实际的刷新面板逻辑
   * @param e
   * @param fromMys
   * @returns {Promise<boolean|*>}
   */
  async doRefresh (e, fromMys = false) {
    let uid = await getTargetUid(e)
    if (!uid) {
      e._replyNeedUid || e.reply([`你还未绑定${player.game === 'sr' ? `“星铁”` :`“原神”` }UID，请先发送：${player.game === 'sr' ? `【*绑定123456789】` :`【#绑定123456789】` }以此来绑定你的${player.game === 'sr' ? `“星铁”` :`“原神”` }查询目标，绑定完成后 请发送${player.game === 'sr' ? `【*更新面板】` :`【#更新面板】` }以此更新你的${player.game === 'sr' ? `“星铁”` :`“原神”` }角色详情\n或是发送【#扫码登录】一键绑定米游社所有UID\n如需使用其它功能可使用【可可帮助】【#帮助】【*帮助】【#喵喵帮助】等查看可用功能`, new Button(e).bindUid()], false, { at: true })
      return true
    }

    // 数据更新
    let player = Player.create(e)
    await player.refreshProfile(2, fromMys)    

    if (!player?._update?.length) {
      e._isReplyed || e.reply([`获取UID:${player.uid}的${char.name}面板数据失败，请确认${char.name}已在游戏内橱窗展示，并开放了查看详情。设置完毕后请5分钟后再进行请求~`, new Button(e).profileList(uid)])
      e._isReplyed = true
    } else {
      let ret = {}
      lodash.forEach(player._update, (id) => {
        let char = Character.get(id)
        if (char) {
          ret[char.name] = true
        }
      })
      if (lodash.isEmpty(ret)) {
        e._isReplyed || e.reply([`获取UID:${player.uid}的${char.name}面板数据失败，未能请求到${char.name}数据。请确认${char.name}已在游戏内橱窗展示，并开放了查看详情。设置完毕后请5分钟后再进行请求~`, new Button(e).profileList(uid)])
        e._isReplyed = true
      } else {
        e.newChar = ret
        e.isNewCharFromMys = fromMys
        return await ProfileList.render(e)
      }
    }
    return true
  },

  /**
   * 刷新面板
   * @param e
   * @returns {Promise<boolean|*>}
   */
  async refresh (e) {
    return await ProfileList.doRefresh(e, false)
  },

  /**
   * 米游社刷新面板
   * @param e
   * @returns {Promise<boolean|*>}
   */
  async refreshMys (e) {
    return await ProfileList.doRefresh(e, true)
  },

  /**
   * 渲染面板
   * @param e
   * @returns {Promise<boolean|*>}
   */

  async render (e) {
    let uid = await getTargetUid(e)
    if (!uid) {
      e._replyNeedUid || e.reply([`你还未绑定${player.game === 'sr' ? `“星铁”` :`“原神”` }UID，请先发送：${player.game === 'sr' ? `【*绑定123456789】` :`【#绑定123456789】` }以此来绑定你的${player.game === 'sr' ? `“星铁”` :`“原神”` }查询目标，绑定完成后 请发送${player.game === 'sr' ? `【*更新面板】` :`【#更新面板】` }以此更新你的${player.game === 'sr' ? `“星铁”` :`“原神”` }角色详情\n或是发送【#扫码登录】一键绑定米游社所有UID\n如需使用其它功能可使用【可可帮助】【#帮助】【*帮助】【#喵喵帮助】等查看可用功能`, new Button(e).bindUid()], false, { at: true })
      return true
    }

    let isSelfUid = false
    if (e.runtime && e.runtime?.user) {
      let uids = []
      let user = e.runtime.user
      if (typeof user.getCkUidList === 'function') {
        uids = user.getCkUidList(e.game).map(i => i.uid) || []
      } else {
        uids = user.ckUids || []
      }
      isSelfUid = uids.some(ds => ds === uid + '')
    }
    let rank = false

    let hasNew = false
    let newCount = 0

    let chars = []
    let msg = ''
    let newChar = {}
    if (e.newChar) {
      msg = '获取角色面板数据成功'
      newChar = e.newChar
    }
    const cfg = await Data.importCfg('cfg')
    // 获取面板数据
    let player = Player.create(e)
    let servName = e.isNewCharFromMys ? '米游社' : Player.getProfileServName(uid, player.game)
    if (!player.hasProfile) {
      await player.refresh({ profile: true })
    }
    if (!player.hasProfile) {
      e.reply([`本地暂无uid${uid}[${player.game}]的面板数据...\n\n若是未实装角色请使用 *面板帮助 或 #面板帮助 来查看如何进行面板替换(前提是本地有该角色的数据)`, new Button(e).profileList(uid)],false,{ at: true })
      return true
    }
    let profiles = player.getProfiles()

    // 检测标志位
    let qq = (e.at && !e.atBot) ? e.at : e.user_id
    await ProfileRank.setUidInfo({ uid, profiles, qq, uidType: isSelfUid ? 'ck' : 'bind' })

    let groupId = e.group_id
    if (groupId) {
      rank = await ProfileRank.create({ groupId, uid, qq: e.user_id })
    }
    const rankCfg = await ProfileRank.getGroupCfg(groupId)
    const groupRank = rank && (cfg?.diyCfg?.groupRank || false) && rankCfg.status !== 1
    for (let id in profiles) {
      let profile = profiles[id]
      let char = profile.char
      let tmp = char.getData('id,face,name,abbr,element,star')
      let imgs = char.getImgs(profile.costume)
      tmp.face = imgs.qFace || imgs.face
      tmp.level = profile.level || 1
      tmp.cons = profile.cons
      tmp.isNew = 0
      if (newChar[char.name]) {
        tmp.isNew = 1
        newCount++
      }
      if (rank) {
        tmp.groupRank = await rank.getRank(profile, !!tmp.isNew)
      }
      chars.push(tmp)
    }

    // mys 更新不是通过橱窗展柜，可能突破此限制
    // if (newCount > 0) {
    //   hasNew = newCount <= 12
    // }
    hasNew = newCount > 0
    newCount = chars.length
    servName = '米游社'

    chars = lodash.sortBy(chars, ['isNew', 'star', 'level', 'id'])
    chars = chars.reverse()

    player.save()
    // 渲染图像
    return e.reply([await Common.render('character/profile-list', {
      save_id: uid,
      uid,
      chars,
      servName,
      hasNew,
      mz: e.nickname,
      newChar,
      newCount,
      game: e.isSr ? 'sr' : 'gs',
      msg,
      groupRank,
      updateTime: player.getUpdateTime(),
      allowRank: rank && rank.allowRank,
      rankCfg,
      elem: player.isGs ? 'hydro' : 'sr'
    }, { e, scale: 1.6, retType: 'base64' }), new Button(e).profileList(uid, newChar)])
  },

  /**
   * 删除面板数据
   * @param e
   * @returns {Promise<boolean>}
   */
  async del (e) {
    let ret = /^#(星铁)?(删除全部面板|删除面板|删除面板数据)\s*(\d{9,10})?$/.exec(e.msg)
    let uid = await getTargetUid(e)
    if (!uid) {
      return true
    }
    let targetUid = ret[3]

    let user = e?.runtime?.user || {}
    if (!user.hasCk && !e.isMaster) {
      e.reply('为确保数据安全，目前仅允许绑定CK用户删除自己UID的面板数据，请联系Bot主人删除...')
      return true
    }

    if (!targetUid) {
      e.reply([`你确认要删除面板数据吗？ 请回复 #删除面板${uid} 以删除面板数据`, new Button(e).profileList(uid)])
      return true
    }

    const game = /星铁/.test(e.msg) ? 'sr' : 'gs'
    let uidList = user?.getCkUidList(game)
    let ckUids = (lodash.map(uidList, (ds) => ds.uid) || []).join(',').split(',')
    if (!ckUids.includes(targetUid) && !e.isMaster) {
      e.reply([`仅允许删除自己的UID数据[${ckUids.join(',')}]`, new Button(e).profileList(uid)])
      return true
    }

    Player.delByUid(targetUid, game)
    e.reply([`UID${targetUid}的本地数据已删除，排名数据已清除...`, new Button(e).profileList(uid)])
    return true
  },

  async reload (e) {
    let uid = await getTargetUid(e)
    if (!uid) {
      return true
    }
    let player = Player.create(e)
    player.reload()
    return ProfileList.render(e)
  }
}
export default ProfileList
