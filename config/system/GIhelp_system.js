/**
 * 请注意，系统不会读取help_default.js ！！！！
 * 【请勿直接修改此文件，且可能导致后续冲突】
 *
 * 如需自定义可将文件【复制】一份，并重命名为 help.js
 *
 * */

export const helpCfg = {
    themeSet: true,
    title: 'Genshin Impact-Help',
    subTitle: '云梦提醒：这里是原神功能，星铁功能请发送命令[*帮助]，鸣潮功能请发送命令[~帮助]，方舟功能请发送命令[#方舟帮助]，更多功能请发送命令[可可帮助]',
    columnCount: 3,
    colWidth: 395,
    theme: ['shaonv1'],
    themeExclude: ['default'],
    style: {
      fontColor: '#ceb78b',
      descColor: '#eee',
      contBgColor: 'rgba(6, 21, 31, .5)',
      contBgBlur: 3,
      headerBgColor: 'rgba(6, 21, 31, .4)',
      rowBgColor1: 'rgba(6, 21, 31, .2)',
      rowBgColor2: 'rgba(6, 21, 31, .35)'
    }
  }
  
  export const helpList = [
    {
      group: '使用前必备步骤',
      list: [
        {
          icon: 152,
          title: '#扫码登录 #刷新ck',
          desc: '一键绑定米游社所有UID'
        },
        {
          icon: 152,
          title: '#ck查询 #米币查询',
          desc: 'ck绑定的游戏账号和米游币数量'
        },
        {
          icon: 152,
          title: '#绑定123456789',
          desc: '笨蛋！明明扫码登录可以一劳永逸'
        }
      ]
    },   {
      group:'常用查询数据命令',
      list:[
        {
          icon: 152,
          title: '#体力',
          desc: '查询原神体力'
        },
        {
          icon: 152,
          title: '#角色 #探索 #练度统计',
          desc: '什么？你要查查我的原神浓度？'
        },
        {
          icon: 152,
          title: '#深渊 #剧诗',
          desc: '哦呀？你醒啦？该去凹深渊啦！'
        },
        {
          icon: 152,
          title: '#更新抽卡记录 #抽卡记录',
          desc: '刚抽完卡请的吧2小时后再查喔 ~'
        },
        {
          icon: 152,
          title: '#签到 #社区签到',
          desc: ''
        },
        {
          icon: 152,
          title: '#圣遗物列表',
          desc: '该死的欧皇，决战的时刻到了！'
        },
        {
          icon: 152,
          title: '#兑换码',
          desc: '获取前瞻中的300原石兑换码'
        },
        {
          icon: 152,
          title: '#活动',
          desc: '看看还有什么活动的原石没拿完'
        },
        {
          icon: 152,
          title: '留空',
          desc: '强迫症对称用'
        }
      ]
    }, {
      group: '面板相关命令',
      list: [
        {
          icon: 152,
          title: '#更新面板 #可莉面板/伤害',
          desc: '面板可参与排名，命令看后面'
        },
        {
          icon: 152,
          title: '#纳西妲面板换草套',
          desc: '其他更换命令请发送 #面板帮助'
        },
        {
          icon: 152,
          title: '#最强排名 #最高分排名',
          desc: '速速更新面板，加入单群PVP！'
        },
        {
          icon: 152,
          title: '#希格雯排名 *最强/最高分希格雯',
          desc: '看见了吗？这就是我的实力！'
        },
        {
          icon: 152,
          title: '#极限可莉',
          desc: '理论上的角色极限，非真实数据'
        },
        {
          icon: 152,
          title: '#队伍伤害纳西妲，妮露，海森',
          desc: '非常好用，使我提瓦特物种灭绝'
        }
      ]
    }, {
      group: '其他查询数据命令',
      list: [
        {
          icon: 152,
          title: '#希格雯天赋 #希格雯命座',
          desc: '角色天赋详情和命座详情'
        },
        {
          icon: 152,
          title: '#角色持有率 #深渊出场率',
          desc: '以上统计数据来源于胡桃网站'
        },
        {
          icon: 152,
          title: '#原石统计',
          desc: '每月原石收入'
        },
        {
          icon: 152,
          title: '#今日材料 #明日材料',
          desc: '对应已有角色武器查询可刷材料'
        },
        {
          icon: 152,
          title: '#刷新天赋 #天赋统计',
          desc: '#周三天赋 #四/五星练度统计'
        },
        {
          icon: 152,
          title: '#日历',
          desc: '活动版本倒计时以及活动信息'
        },
        {
          icon: 152,
          title: '#原神注册时间',
          desc: '通过官方活动获取游戏注册时间'
        },
        {
          icon: 152,
          title: '留空',
          desc: '强迫症对称用'
        },
        {
          icon: 152,
          title: '留空',
          desc: '强迫症对称用'
        }
      ]
    }, {
      group: '攻略养成命令',
      list: [
        {
          icon: 152,
          title: '#幽光星星在哪',
          desc: '由米游社观测枢的地图资源生成'
        },
        {
          icon: 152,
          title: '#米游社漂浮灵路线',
          desc: '你居然在企鹅上查米游社的帖子'
        },
        {
          icon: 152,
          title: '#希格雯图鉴 #白雨心弦图鉴',
          desc: '都看图鉴了，顺便看看养成吧~'
        },
        {
          icon: 152,
          title: '#纳西妲养成 #纳西妲图鉴',
          desc: '都看养成了，顺便看看图鉴吧~'
        },
        {
          icon: 152,
          title: '#那维莱特攻略',
          desc: '来源于米游社各作者的角色攻略'
        },
        {
          icon: 152,
          title: '#夜魂本 #猎人本',
          desc: '圣遗物信息/秘境怪物分布位置一览'
        },
        {
          icon: 152,
          title: '#七圣查询角色牌/行动牌',
          desc: '牌组命令请发送#七圣查询牌组1'
        },
        {
          icon: 152,
          title: '留空',
          desc: '强迫症对称用'
        },
        {
          icon: 152,
          title: '留空',
          desc: '强迫症对称用'
        }
      ]
    }, {
      group: '其他帮助命令',
      list: [
        {
          icon: 152,
          title: '*帮助',
          desc: '星铁帮助，不要啊，这个不可以查'
        },
        {
          icon: 152,
          title: '%帮助',
          desc: '原生帮助，不行了，好长塞不下'
        },
        {
          icon: 152,
          title: '~帮助',
          desc: '鸣潮帮助，闲来无事，。。。'
        },
        {
          icon: 152,
          title: '#方舟帮助',
          desc: '原生帮助，好满足，里面全塞满了'
        },
        {
          icon: 152,
          title: '#喵喵帮助',
          desc: '所有帮助一览，好多啊，。。。。'
        },
        {
          icon: 152,
          title: '#可可帮助',
          desc: '可可帮助，你讨厌，说了不许查的'
        }
      ]
    }, {
      group: '更多贴心小功能',
      list: [
        {
          icon: 152,
          title: '#公告 #资讯 #活动',
          desc: '官方发布后会自动推送到群内~'
        },
        {
            icon: 152,
            title: '#可莉别名 #设置可莉别名',
            desc: '给心爱的角色设置最喜欢的称呼'
        },
        {
            icon: 152,
            title: '#点歌 让风告诉你',
            desc: 'VIP的歌曲也能点喔，很神奇吧！'
        },
        {
            icon: 152,
            title: '#今日运势',
            desc: ''
        },
        {
            icon: 152,
            title: '#塔罗牌',
            desc: ''
        },
        {
            icon: 152,
            title: '回复消息 + 撤丨禁 | 禁撤 丨踢',
            desc: '回复消息形式的群管指令(所有人可用，需要 归终 是管理)'
        },
        {
          icon: 152,
          title: '更多功能敬请期待',
          desc: '反正写了你们也不看，摆烂...'
        },
        {
          icon: 152,
          title: '留空',
          desc: '强迫症对称用'
        },
        {
          icon: 152,
          title: '留空',
          desc: '强迫症对称用'
        }
      ]
    }
  ]