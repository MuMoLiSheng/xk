/*
* 此配置文件为系统使用，请勿修改，否则可能无法正常使用
*
* 如需自定义配置请复制修改上一级help_default.js
*
* */

export const helpCfg = {
  themeSet: true,
  title: '可歌岁月',
  subTitle: '可可 & 可梦归处',
  columnCount: 3,
  colWidth: 290,
  bgBlur: false,
  theme: ['kk1'],
  themeExclude: ['default'],
  style: {
    fontColor: '#ceb78b',
    descColor: '#eee',
    contBgColor: 'rgba(6, 21, 31, .5)',
    contBgBlur: 2,
    headerBgColor: 'rgba(6, 21, 31, .4)',
    rowBgColor1: 'rgba(6, 21, 31, .2)',
    rowBgColor2: 'rgba(6, 21, 31, .35)'
  }
}

export const helpList = [
  {
    group: '可望云归',
    list: [
      {
        icon: 119,
        title: '抽签',
        desc: '抽御神签'
      },
      {
        icon: 120,
        title: '塔罗牌',
        desc: '占卜'
      },
      {
        icon: 94,
        title: '21点',
        desc: '开局21点游戏'
      },
      {
        icon: 138,
        title: '今天吃什么',
        desc: '美食菜单推荐'
      },
      {
        icon: 114,
        title: '添加/删除食物',
        desc: '更改菜单'
      },
      {
        icon: 64,
        title: 'r/roll',
        desc: '在1和你输入的数字间roll'
      },
      {
        icon: 112,
        title: '切换名片样式1-9',
        desc: '切换群名称后缀'
      },
      {
        icon: 106,
        title: '活动',
        desc: '查看星铁、原神后续活动等信息'
      },
      {
        icon: 46,
        title: '回复消息 + 撤丨禁丨踢',
        desc: '回复消息形式的群管指令'
      },
      {
        icon: 76,
        title: '#新增(模糊|精确)?(踢|禁|撤|踢撤|禁撤)?违禁词<违禁词>',
        desc: '新增违禁词(需要归终是管理)'
      },
      {
        icon: 139,
        title: '#违禁词列表',
        desc: '查看本群已添加的违禁词'
      },
      {
        icon: 152,
        title: '#活动排期表',
        desc: '查看原铁版本活动'
      },
      {
        icon: 152,
        title: '#前瞻 #立绘 #预下载',
        desc: '查看原铁版本更新、立绘、预下载时间'
      },
      {
        icon: 152,
        title: '#深渊排期表',
        desc: '查看原铁深渊更新时间以及最后一层怪物'
      },
      {
        icon: 85,
        title: '开启/关闭维护模式',
        desc: '进行重要更新时可开启维护模式'
      }
    ]
  },
  {
    group:'可游仙境',
    list:[
      {
        icon: 79,
        title: '可可帮助',
        desc: '查看可可插件帮助（也就是此面板啦 ~）'
      },
      {
        icon: 79,
        title: '#喵喵帮助',
          desc: '所有帮助一览'
      },
      {
        icon: 79,
        title: '#帮助',
        desc: '查看原神帮助'
      },
      {
        icon: 79,
        title: '*帮助',
        desc: '查看星铁帮助'
      },
      {
        icon: 79,
        title: '~鸣潮帮助',
        desc: '查看鸣潮帮助'
      },
      {
        icon: 79,
        title: '#方舟帮助',
        desc: '查看明日方舟帮助'
      },
      {
        icon: 79,
        title: '#优纪帮助',
        desc: '查看优纪帮助'
      },
      {
        icon: 79,
        title: '#枫叶帮助',
        desc: '查看枫叶帮助'
      },
      {
        icon: 79,
        title: '#椰奶帮助',
        desc: '查看椰奶帮助'
      },
      {
        icon: 79,
        title: '#椰奶群管帮助',
        desc: '查看椰奶群管帮助'
      },
      {
        icon: 79,
        title: '#咸鱼帮助',
        desc: '查看咸鱼帮助'
      },
      {
        icon: 79,
        title: '#小飞帮助',
        desc: '查看小飞帮助'
      },
      {
        icon: 79,
        title: '%帮助',
        desc: '查看绝区零帮助'
      },
      {
        icon: 79,
        title: '#地图资源列表',
        desc: '查看原神大世界地图资源列表'
      },
      {
        icon: 79,
        title: '#meme列表 #meme帮助',
        desc: '查看meme可合成表情列表'
      },
      {
        icon: 79,
        title: '#逍遥帮助',
        desc: '查看逍遥帮助'
      },
      {
        icon: 79,
        title: '*面板帮助 #面板帮助',
        desc: '查看面板替换帮助'
      },
      {
        icon: 152,
        title: '留空',
        desc: '强迫症对称用'
      }
    ]
  },
  {
    group: '可寻旧梦',
    auth: 'master',
    list: [
      {
        icon: 85,
        title: '#可可设置',
        desc: '配置可可功能'
      },
      {
        icon: 112,
        title: '#可可更新',
        desc: '更新可可版本'
      },
      {
        icon: 113,
        title: '#全部更新 #静默全部更新',
        desc: '更新/静默更新所有插件'
      },
      {
        icon: 85,
        title: '#喵喵设置面板服务1-4',
        desc: '设置原神面板服务'
      },
      {
        icon: 85,
        title: '#喵喵设置星铁面板服务1-4',
        desc: '设置星铁面板服务'
      },
      {
        icon: 106,
        title: '#状态 #椰奶状态',
        desc: '查看当前状态'
      },
      {
        icon: 85,
        title: '#锅巴登录',
        desc: '后台管理界面'
      },
      {
        icon: 92,
        title: '#备份 #还原',
        desc: '备份与还原配置文件'
      },
      {
        icon: 92,
        title: '#关机 #重启',
        desc: '关机或重启归终'
      }
    ]
  }
]

export const isSys = true