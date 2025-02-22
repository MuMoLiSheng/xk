/**
* 请注意，系统不会读取help_default.js ！！！！
* 【请勿直接修改此文件，且可能导致后续冲突】
*
* 如需自定义可将文件【复制】一份，并重命名为 help.js
*
* */

// 帮助配置
export const helpCfg = {
  // 帮助标题
  title: '可歌岁月',

  // 帮助副标题
  subTitle: '可可 & 可梦归处',

  // 帮助表格列数，可选：2-5，默认3
  // 注意：设置列数过多可能导致阅读困难，请参考实际效果进行设置
  colCount: 3,

  // 单列宽度，默认265
  // 注意：过窄可能导致文字有较多换行，请根据实际帮助项设定
  colWidth: 290,

  // 皮肤选择，可多选，或设置为all
  // 皮肤包放置于 resources/help/theme
  // 皮肤名为对应文件夹名
  // theme: 'all', // 设置为全部皮肤
  // theme: ['default','theme2'], // 设置为指定皮肤
  theme: 'all',

  // 排除皮肤：在存在其他皮肤时会忽略该项内设置的皮肤
  // 默认忽略default：即存在其他皮肤时会忽略自带的default皮肤
  // 如希望default皮肤也加入随机池可删除default项
  themeExclude: ['default'],

  // 是否启用背景毛玻璃效果，若渲染遇到问题可设置为false关闭
  bgBlur: false
}

// 帮助菜单内容
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
        title: '#新增正则违禁词/违禁词/',
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
        title: '#帮助',
        desc: '查看原神帮助（默认帮助）'
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
