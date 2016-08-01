import http from 'http'
import https from 'https'
import iconv from 'iconv-lite'
import { parse } from 'url'

const httpLibs = { 'http:': http, 'https:': https }

// Request helper taken from fent/node-ytdl-core
// https://github.com/fent/node-ytdl-core/blob/master/lib/request.js
export const getBody = (url, decode = false) => new Promise((resolve, reject) => {
  const parsed = parse(url)
  const httpLib = httpLibs[parsed.protocol]
  if (!httpLib) return reject(new Error('Invalid URL: ' + url))

  const req = httpLib.get(parsed)
  req.on('response', res => {
    if (res.statusCode !== 200) {
      return reject(new Error('Status code ' + res.statusCode))
    }

    let chunks = []
    res.on('data', chunk => chunks.push(chunk))
    res.on('end', () => {
      const body = iconv.decode(Buffer.concat(chunks), decode ? 'ISO-8859-1' : 'utf-8')
      resolve({ body, res })
    })
  })

  req.on('error', reject)
})

export const cleanText = t => t.trim().replace(/[\r\n\t]/ig, '')
