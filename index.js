import fs from 'node:fs'
import chalk from 'chalk'

if (!global.segment) {
  global.segment = (await import("oicq")).segment
}

if (!global.core) {
  try {
    global.core = (await import("oicq")).core
  } catch (err) {}
}

const files = fs.readdirSync('./plugins/xk/apps').filter(file => file.endsWith('.js'))

let ret = []
logger.info(chalk.rgb(255, 225, 255)('---------------------*---------------------'))
logger.info(chalk.rgb(255, 225, 255)('-------------❀小可☆(≧▽≦)☆沐沐❀-------------'))
logger.info(chalk.rgb(255, 225, 255)('--------------Created By 沐沐--------------'))
logger.info(chalk.rgb(255, 225, 255)(`      感谢您的使用!!!小可插件载入成功      `))
logger.info(chalk.rgb(255, 225, 255)('---------------------*---------------------'))

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')

  if (ret[i].status != 'fulfilled') {
    logger.error(`${chalk.rgb(60, 159, 240)(`[小可]`)}` + `载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}
export { apps }
