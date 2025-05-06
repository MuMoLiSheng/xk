export const cfgSchema = {
  apps: {
    title: 'Miao-Yunzai功能（开启使用可可版功能）',
    cfg: {
      help: {
        title: '#帮助 #菜单',
        key: '帮助',
        def: false,
        xk: true
      },
      SRhelp: {
        title: '*帮助 *星铁帮助',
        key: '星铁帮助',
        def: false,
        xk: true
      },
      GIhelp: {
        title: '#帮助 #原神帮助',
        key: '原神帮助',
        def: false,
        xk: true
      }
    }
  },
  sys: {
    title: '系统设置',
    cfg: {
      renderScale: {
        title: '渲染精度',
        key: '渲染',
        type: 'num',
        def: 200,
        input: (n) => Math.min(200, Math.max(50, (n * 1 || 100))),
        desc: '可选值50~200，建议100。设置高精度会提高图片的精细度，但因图片较大可能会影响渲染与发送速度'
      },
    }
  }
}
