import YAML from 'yaml'
import fs from 'node:fs'
import chalk from 'chalk'
import chokidar from 'chokidar'

class Setting {
  constructor () {
    /** 默认设置 */
    this.defPath = `./plugins/xk/defSet/`
    this.defSet = {}

    /** 用户设置 */
    this.configPath = `./plugins/xk/config/`
    this.config = {}

    this.dataPath = `./plugins/xk/data/`
    this.data = {}

    /** 监听文件 */
    this.watcher = { config: {}, defSet: {} }
  }

  /** 配置对象化 用于锅巴插件界面填充 */
  merge () {
    let sets = {}
    let appsConfig = fs.readdirSync(this.defPath).filter(file => file.endsWith(".yaml"));
    for (let appConfig of appsConfig) {
      // 依次将每个文本填入键
      let filename = appConfig.replace(/.yaml/g, '').trim()
      sets[filename] = this.getConfig(filename)
    }
    return sets
  }

  /** 配置对象分析 用于锅巴插件界面设置 */
  analysis(config) {
    for (let key of Object.keys(config)){
      this.setConfig(key, config[key])
    }
  }

  /** 获取对应模块数据文件 */
  getData (path, filename) {
    path = `${this.dataPath}${path}/`
    try {
      if (!fs.existsSync(`${path}${filename}.yaml`)){ return false}
      return YAML.parse(fs.readFileSync(`${path}${filename}.yaml`, 'utf8'))
    } catch (error) {
      logger.error(`${chalk.rgb(240, 75, 60)(`[小可][${filename}] 读取失败 ${error}`)}`)
      return false
    }
  }

  /** 写入对应模块数据文件 */
  setData (path, filename, data) {
    path = `${this.dataPath}${path}/`
    try {
      if (!fs.existsSync(path)){
        /** 递归创建目录 */
        fs.mkdirSync(path, { recursive: true });
      }
      fs.writeFileSync(`${path}${filename}.yaml`, YAML.stringify(data),'utf8')
    } catch (error) {
      logger.error(`${chalk.rgb(240, 75, 60)(`[小可][${filename}] 写入失败 ${error}`)}`)
      return false
    }
  }
  /**
   * @param app  功能
   * @param name 配置文件名称
   */
  /** 获取对应模块默认配置 */
  getdefSet (app, name) {
    return this.getYaml(app, name, 'defSet')
  }

  /** 获取对应模块用户配置 */
  /** 用户配置 */
  getConfig(app, name) {
    let ignore = []

    if (ignore.includes(`${app}.${name}`)) {
      return this.getYaml(app, name, "config")
    }

    return {
      ...this.getdefSet(app, name),
      ...this.getYaml(app, name, "config"),
    }
  }

  /** 设置对应模块用户配置 */
  setConfig (app, name, Object) {
    return this.setYaml(app, name, 'config', { ...this.getdefSet(app, name), ...Object})
  }

  /** 将对象写入YAML文件 */
  setYaml (app, name, type, Object){
    let file = this.getFilePath(app, name, type)
    try {
      fs.writeFileSync(file, YAML.stringify(Object),'utf8')
    } catch (error) {
      logger.error(`${chalk.rgb(240, 75, 60)(`[小可][${app}${name}] 写入失败 ${error}`)}`)
      return false
    }
  }

  /**
   * 获取配置yaml
   * @param app 功能
   * @param name 名称
   * @param type 默认跑配置-defSet，用户配置-config
   */
  getYaml (app, name, type) {
    let file = this.getFilePath(app, name, type)
    let key = `${app}.${name}`
    if (this[type][key]) return this[type][key]

    try {
      this[type][key] = YAML.parse(fs.readFileSync(file, 'utf8'))
    } catch (error) {
      logger.error(`${chalk.rgb(240, 75, 60)(`[小可][${key}] 格式错误 ${error}`)}`)
      return false
    }
    this.watch(file, app, name, type)
    return this[type][key]
  }

  /** 获取YAML文件目录 */
  getFilePath (app, name, type) {
    if (type === 'defSet') return `${this.defPath}${app}/${name}.yaml`
    else {
      try {
        if (!fs.existsSync(`${this.configPath}${app}.${name}.yaml`)) {
          fs.copyFileSync(`${this.defPath}${app}/${name}.yaml`, `${this.configPath}${app}.${name}.yaml`)
        }
      } catch (error) {
        logger.error(`${chalk.rgb(240, 75, 60)(`[小可]缺失默认文件[${app}]${error}`)}`)
      }
      return `${this.configPath}${app}.${name}.yaml`
    }
  }


  /** 监听配置文件 */
  watch (file, app, name, type = 'defSet') {
        let key = `${app}.${name}`
    if (this.watcher[type][key]) return

    const watcher = chokidar.watch(file)
    watcher.on('change', path => {
      delete this[type][app]
      logger.mark(`${chalk.rgb(60, 159, 240)(`[小可][修改配置文件][${type}][${app}][${name}]`)}`)
      if (this[`change_${app}${name}`]) {
        this[`change_${app}${name}`]()
      }
    })
    this.watcher[type][key] = watcher
  }
}

export default new Setting()