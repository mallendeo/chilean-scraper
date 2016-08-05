import http from 'http'
import https from 'https'
import iconv from 'iconv-lite'
import cheerio from 'cheerio'
import { parse } from 'url'

const httpLibs = { 'http:': http, 'https:': https }

// Request helper taken from fent/node-ytdl-core
// https://github.com/fent/node-ytdl-core/blob/master/lib/request.js
export const getDOM = url => new Promise((resolve, reject) => {
  const parsed = parse(url)
  const httpLib = httpLibs[parsed.protocol]
  if (!httpLib) {
    reject(new Error(`Invalid URL: ${url}`))
    return
  }

  const req = httpLib.get(parsed)
  req.on('response', res => {
    if (res.statusCode !== 200) {
      reject(new Error(`Status code ${res.statusCode}`))
      return
    }

    const chunks = []
    res.on('data', chunk => chunks.push(chunk))
    res.on('end', () => {
      const decode = res.headers['content-type']
        && res.headers['content-type'].toLowerCase().includes('iso-8859-1')

      const body = iconv.decode(Buffer.concat(chunks), decode ? 'iso-8859-1' : 'utf-8')
      const $ = cheerio.load(body)

      resolve({ $, res, body })
    })
  })

  req.on('error', reject)
})

export const cleanText = t => t.trim().replace(/[\r\n\t]/ig, '')
