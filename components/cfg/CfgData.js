
import fs from 'node:fs'
import lodash from 'lodash'
import { Data } from '#xk'
import { xkPath } from '#xk.path'
import { cfgSchema } from '../../config/system/cfg_system.js'

let cfgData = {
  saveCfg (cfg) {
    let ret = []
    lodash.forEach(cfgSchema, (cfgGroup) => {
      ret.push(`/** ************ 【${cfgGroup.title}】 ************* */`)
      lodash.forEach(cfgGroup.cfg, (cfgItem, cfgKey) => {
        ret.push(`// ${cfgItem.desc || cfgItem.title}`)
        let val = Data.def(cfg[cfgKey], cfgItem.def)
        if (cfgItem.input) {
          val = cfgItem.input(val)
        }
        if (cfgItem.type === 'str') {
          ret.push(`export const ${cfgKey} = '${val.toString()}'`, '')
        } else {
          ret.push(`export const ${cfgKey} = ${val.toString()}`, '')
        }
      })
    })
    fs.writeFileSync(`${xkPath}/config/cfg.js`, ret.join('\n'), 'utf8')
  },

  async getCfg () {
    let ret = lodash.toPlainObject(await Data.importModule('/config/cfg.js', 'xk'))
    lodash.forEach(cfgSchema, (cfgGroup) => {
      lodash.forEach(cfgGroup.cfg, (cfgItem, cfgKey) => {
        ret[cfgKey] = Data.def(ret[cfgKey], cfgItem.def)
      })
    })
    return ret
  },

  getCfgSchemaMap () {
    let ret = {}
    lodash.forEach(cfgSchema, (cfgGroup) => {
      lodash.forEach(cfgGroup.cfg, (cfgItem, cfgKey) => {
        ret[cfgItem.key] = cfgItem
        cfgItem.cfgKey = cfgKey
      })
    })
    return ret
  },
  getCfgSchema () {
    return cfgSchema
  }
}
export default cfgData
