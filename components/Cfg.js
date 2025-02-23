import fs from 'node:fs'
import lodash from 'lodash'
import { Version } from '#xk'
import { xkPath } from '#xk.path'
import cfgData from './cfg/CfgData.js'

const _cfgPath = `${xkPath}/components/`
let cfg = {}
let xkCfg = {}


try {
  cfg = await cfgData.getCfg()
  cfgData.saveCfg(cfg)
  lodash.forEach(cfgData.getCfgSchemaMap(), (cm) => {
    if (cm.xk) {
      xkCfg[cm.cfgKey] = true
    }
  })
} catch (e) {
  // do nth
}

let Cfg = {
  get (rote, def = '') {
    if (Version.isMiao && xkCfg[rote]) {
      return true
    }
    let ret = lodash.get(cfg, rote)
    return lodash.isUndefined(cfg) ? def : ret
  },
  set (rote, val) {
    cfg[rote] = val
    cfgData.saveCfg(cfg)
  },
  del (rote) {
    lodash.set(cfg, rote, undefined)
    fs.writeFileSync(_cfgPath + 'cfg.json', JSON.stringify(cfg, null, '\t'))
  },
  getCfg () {
    return cfg
  },
  getCfgSchema () {
    return cfgData.getCfgSchema()
  },
  getCfgSchemaMap () {
    return cfgData.getCfgSchemaMap()
  },
  scale (pct = 1) {
    let scale = Cfg.get('renderScale', 100)
    scale = Math.min(2, Math.max(0.5, scale / 100))
    pct = pct * scale
    return `style=transform:scale(${pct})`
  }
}

export default Cfg
