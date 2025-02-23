import fs from 'fs'
import util from 'util'
import axios from 'axios'
import stream from 'stream'

const pipeline = util.promisify(stream.pipeline)

export default async (url, savedPath) => {
  try {
    const request = await axios.get(encodeURI(url), {
      responseType: 'stream'
    })
    await pipeline(request.data, fs.createWriteStream(savedPath))
  } catch (error) {
    console.log(error)
    return 'error'
  }
}
