import { Version, Cfg } from './index.js'
import { xkPath } from '#xk.path'

const Render = {
  async render (path, params, cfg) {
    let { e } = cfg
    if (!e.runtime) {
      console.log('未找到e.runtime，请升级至最新版Yunzai')
    }
    return e.runtime.render(cfg.plugin || 'xk', path, params, {
      retType: cfg.retType || (cfg.retMsgId ? 'msgId' : 'default'),
      beforeRender ({ data }) {
        let pluginName = ''
        if (data.pluginName !== false) {
          pluginName = ` & ${data.pluginName || 'xk'}`
          if (data.pluginVersion !== false) {
            pluginName += `<span class="version">${data.pluginVersion || Version.version}`
          }
        }
        let resPath = data.pluResPath
        const layoutPath = xkPath + '/resources/common/layout/'
        return {
          _xk_path: resPath,
          ...data,
          _res_path: resPath,
          _layout_path: layoutPath,
          _tpl_path: xkPath + '/resources/common/tpl/',
          defaultLayout: layoutPath + 'default.html',
          elemLayout: layoutPath + 'elem.html',
          sys: {
            scale: Cfg.scale(cfg.scale || 1)
          },
          copyright: `Created By ${Version.name}<span class="version">${Version.yunzai}</span>可可</span>`
        }
      }
    })
  }
}

export default Render
