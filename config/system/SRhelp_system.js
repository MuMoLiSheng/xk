/**
 * 请注意，系统不会读取help_default.js ！！！！
 * 【请勿直接修改此文件，且可能导致后续冲突】
 *
 * 如需自定义可将文件【复制】一份，并重命名为 help.js
 *
 * */

export const helpCfg = {
    themeSet: true,
    title: 'Star Rail-Help',
    subTitle: '归云梦提醒：这里是星铁功能，原神功能请发送命令[#帮助]，鸣潮功能请发送命令[~帮助]，方舟功能请发送命令[#方舟帮助]，更多功能请发送命令[可可帮助]',
    columnCount: 3,
    colWidth: 395,
    theme: ['huahuo1'],
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
          title: '*绑定123456789',
          desc: '笨蛋！明明扫码登录可以一劳永逸'
        }
      ]
    },   {
      group:'常用查询数据命令',
      list:[
        {
          icon: 152,
          title: '*体力',
          desc: '查询星铁体力'
        },
        {
          icon: 152,
          title: '*角色 *探索 *练度统计',
          desc: '来吧！快来查查我的星铁成分！'
        },
        {
          icon: 152,
          title: '*深渊 *虚构 *末日',
          desc: '哦呀？你醒啦？该去凹深渊啦！'
        },
        {
          icon: 152,
          title: '*抽卡记录 *全部抽卡记录',
          desc: '需要手动获取链接发送'
        },
        {
          icon: 152,
          title: '*签到 *社区签到',
          desc: ''
        },
        {
          icon: 152,
          title: '*遗器列表',
          desc: '该死的欧皇，决战的时刻到了！'
        },
        {
          icon: 152,
          title: '*兑换码',
          desc: '获取前瞻中的300星琼兑换码'
        },
        {
          icon: 152,
          title: '*活动',
          desc: '看看还有什么活动的星琼没拿完'
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
          title: '*更新面板 *花火面板/伤害',
          desc: '面板可参与排名，命令看后面'
        },
        {
          icon: 152,
          title: '*大黑塔面板换学者套',
          desc: '其他更换命令请发送 #面板帮助'
        },
        {
          icon: 152,
          title: '*最强排名 *最高分排名',
          desc: '速速更新面板，加入单群PVP！'
        },
        {
          icon: 152,
          title: '*花火排名 *最强/最高分花火',
          desc: '单群数据统计，请不要失去理智'
        },
        {
          icon: 152,
          title: '*极限黑塔',
          desc: '理论上的角色极限，非真实数据'
        },
        {
          icon: 152,
          title: '留空',
          desc: '强迫症对称用'
        }
      ]
    }, {
      group: '其他查询数据命令',
      list: [
        {
          icon: 152,
          title: '*花火行迹 *花火星魂',
          desc: '角色行迹详情和星魂详情'
        },
        {
          icon: 152,
          title: '*星琼统计',
          desc: '以柱状图显示月份星琼收入'
        },
        {
          icon: 152,
          title: '*日历',
          desc: '活动版本倒计时以及活动信息'
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
          title: '*黑塔 *「我」的诞生',
          desc: '都看图鉴了，顺便看看养成吧~'
        },
        {
          icon: 152,
          title: '*花火养成 *花火',
          desc: '都看养成了，顺便看看图鉴吧~'
        },
        {
          icon: 152,
          title: '*黑塔攻略',
          desc: '没想到吧，左下角有突破材料'
        },
        {
          icon: 152,
          title: '*冰套',
          desc: '星铁遗器信息一览'
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
          title: '#帮助',
          desc: '原神帮助，不要啊，这个不可以查'
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
          title: '*公告 *资讯 *活动',
          desc: '官方发布后会自动推送到群内~'
        },
        {
          icon: 152,
          title: '*花火别名 *设置花火别名',
          desc: '给心爱的角色设置最喜欢的称呼'
        },
        {
            icon: 152,
            title: '#点歌 若你不曾见过太阳',
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