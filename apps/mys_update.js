//容易爆验证码，谨慎使用，米游社的面板数据与enka的会有小数点后几位的小许偏差
import fs from 'node:fs'
import chalk from 'chalk'
import { MysInfo } from '#xk'
import { ProfileList } from '#xk'
import { Restart } from '../../other/restart.js'
import { Character } from '../../miao-plugin/models/index.js'
import { Format } from '../../miao-plugin/components/index.js'
import gs  from '../../miao-plugin/models/serv/api/MysPanelData.js'
import sr from '../../miao-plugin/models/serv/api/MysPanelHSRData.js'

export class mysmb extends plugin {
    constructor() {
        super({
            name: `${chalk.rgb(255, 225, 255)(`[小可]米游社更新面板`)}`,
            dsc: '米游社获取原神、星铁角色详情',
            event: 'message',
            priority: -1314520,
            rule: [{
                reg: /^#(星铁|原神)?(xk)?(全部面板更新|更新全部面板|获取游戏角色详情|更新面板|面板更新)$/,
                fnc: 'mys'
            }, {
                reg: '^#?小可面板文件(替换|还原)$',
                fnc: 'mbwj'
            }, ]
        })
    }
    async mys(e) {
       if(!fs.existsSync('./plugins/xk/models/default/ProfileAvatar_copy.js')){
            if (!e.isMaster) return false
            logger.mark(`${chalk.rgb(244, 67, 67)(`[小可]首次使用该功能，需要修改喵佬的models/avatar/ProfileAvatar.js文件,请发送：小可面板文件替换\n\n后续更新miao-plugin，如果因为该文件引发冲突，可使用:小可面板文件还原`)}`)
            return false
        }
        let User = await MysInfo.get(e, 'UserGame', {}, {}, true)
        if (User?.retcode !== 0) return false
        let uid = await MysInfo.getUid(e, false)
        logger.info(`${chalk.rgb(255, 225, 255)(`[小可]米游社更新面板`)}`)
        await e.reply(`[米游社]正在获取“${e.game === 'sr' ? `星铁` : `原神`}”uid:${uid}的数据，可能会需要一定时间~`,false ,{ at: true})
        let device_fp = await MysInfo.get(e, 'getFp', {}, {}, true)
        if (device_fp?.retcode !== 0) return false
        let headers = { 'x-rpc-device_fp': device_fp?.data?.device_fp }
        let res, data
        if (e.game == 'sr') {
            data = await MysInfo.get(e, 'avatarInfo', { headers }, {}, true)
            if (!data.data) {
                logger.mark(`${chalk.rgb(244, 67, 67)(`[小可]米游社更新面板失败`)}`)
                await e.reply(`“星铁”UID${uid}更新面板失败，当前面板服务米游社，\n可能是ck已失效或还未未绑定ck，正在尝试使用Enka面板服务获取数据，请稍后...\n或者使用【*米游社更新面板】调用喵喵自带的米游社更新服务`,false ,{ at: true})
                return false
            }
            await this.sr_mys(e, data, uid)
        } else if (e.game == 'gs') {
            res = await MysInfo.get(e, 'character', { headers }, {}, true)
            let ids = []
            res.data.list.map((value) => {
                ids.push(value.id)
            })
            data = await MysInfo.get(e, 'character_detail', { headers, ids: ids }, {}, true)
            if (!res.data || !data.data) {
                logger.mark(`${chalk.rgb(244, 67, 67)(`[小可]米游社更新面板失败`)}`)
                await e.reply(`“原神”UID${uid}更新面板失败，当前面板服务米游社，\n可能是ck已失效或还未未绑定ck，正在尝试使用Enka面板服务获取数据，请稍后...\n或者使用【#米游社更新面板】调用喵喵自带的米游社更新服务`,false ,{ at: true})
                return false
            }
            await this.gs_mys(e, data, uid)
        }
        //加载面板列表图
        await ProfileList.render(e)
    }



    /*原神*/
    async gs_mys(e, data, uid) {
        let avatars = {}
        this.property_map = data.data.property_map
        let path = `./data/PlayerData/gs/${uid}.json`
        let mb = {
            'uid': `${uid}`,
            'avatars': {}
        }
        if (fs.existsSync(path)) {
            mb = JSON.parse(fs.readFileSync(path, 'utf8'))
        }
        data.data.list.map((v) => {
            var va = v.base
            //武器
            let weapon = gs.getWeapon(v.weapon)
            //命座影响天赋
            let char = Character.get(va.id)
            let actived_constellation_num = v.base
            let talent = gs.getTalent(char, actived_constellation_num, v.skills)
            //皮肤
            let costume = va.costume?.[0]?.id || 0
            //圣遗物
            let artis = gs.getArtifact(v.relics)
            avatars[va.id] = {
                'name': va.name,
                'id': va.id,
                'elem': va.element.toLowerCase(), //小写
                'level': va.level,
                'fetter': va.fetter,
                'costume': costume,
                'cons': va.actived_constellation_num,
                'talent': talent,
                'weapon': weapon,
                'artis' : artis,
                '_source': 'mys',
                '_time': new Date().getTime(),
                '_update': new Date().getTime(),
                '_talent': new Date().getTime(),
            }
        })
        mb.avatars = avatars
        mb._profile = new Date().getTime()
        fs.writeFileSync(path, JSON.stringify(mb), 'utf-8')
    }



    /*星铁*/
    async sr_mys(e, data, uid) {
        let avatars = {}
        this.property_info = data.data.property_info
        let path = `./data/PlayerData/sr/${uid}.json`
        let mb = {
            'uid': `${uid}`,
            'avatars': {}
        }
        if (fs.existsSync(path)) {
            mb = JSON.parse(fs.readFileSync(path, 'utf8'))
        }
        data.data.avatar_list.map((v) => {
            //光锥
            let weapon = v.equip ? sr.getWeapon(v.equip) : null
            //星魂影响
            let char = Character.get(v.id)
            let servant = v.servant_detail.servant_skills
            let a = v.skills[0].level
            let e = v.skills[1].level
            let q = v.skills[2].level
            let t = v.skills[3].level
            let me, mt
            let talent = sr.getTalent(char, v.rank, v.skills)
            if (servant.length !== 0) {
                me = servant[0].level
                mt = servant[1].level
            }
            for (let x in char.talentCons) {
                if ((v.rank > 4 && char.talentCons[x] == 5) || (v.rank > 2 && char.talentCons[x] == 3)) {
                    if (servant.length !== 0) {
                        switch (x) {
                            case 'a':
                                a = a - 1
                                break
                            case 'e':
                                e = e - 2
                                break
                            case 'q':
                                q = q - 2
                                break
                            case 't':
                                t = t - 2
                                break
                            case 'me':
                                me = me - 1
                                break
                            case 'mt':
                                mt = mt - 1
                                break
                        }
                    }
                }
            }
            //属性
            let elem = Format.elem()
            //行迹
            let trees = sr.getTrees(v.skills)
            //遗器
            let artis = sr.getArtifact([...v.relics, ...v.ornaments])
            avatars[v.id] = {
            'name': v.name,
            'id': v.id,
            'elem': elem,
            'level': v.level,
            'cons': v.rank,
            'talent': servant.length !== 0 ? {
                'a': a,
                'e': e,
                'q': q,
                't': t,
                'me': me,
                'mt': mt
            } : talent,
            'trees': trees,
            'weapon': weapon,
            'artis': artis,
            '_source': 'mys',
            '_time': new Date().getTime(),
            '_update': new Date().getTime(),
            '_talent': new Date().getTime()
            }
        })
        mb.avatars = avatars
        mb._profile = new Date().getTime()
        fs.writeFileSync(path, JSON.stringify(mb), 'utf-8')
    }

    async mbwj(e){
    if (!e.isMaster) return false
    if(e.msg.includes('替换')) {
        fs.cpSync('./plugins/miao-plugin/models/avatar/ProfileAvatar.js','./plugins/xk/models/default/ProfileAvatar_copy.js')
        fs.cpSync('./plugins/xk/models/copy/ProfileAvatar.js','./plugins/miao-plugin/models/avatar/ProfileAvatar.js')
        await e.reply('文件替换完成,准备重启~', true)
        new Restart(e).restart()
        return true
        } else {
        if(!fs.existsSync('./plugins/xk/models/default/ProfileAvatar_copy.js')) {
            await e.reply('没找到原文件。。。', true)
            return true
        }
        fs.cpSync('./plugins/xk/models/default/ProfileAvatar_copy.js','./plugins/miao-plugin/models/avatar/ProfileAvatar.js')
        fs.unlinkSync('./plugins/xk/models/default/ProfileAvatar_copy.js')
        e.reply('文件还原成功！', true)
        return
        }
    }
}
