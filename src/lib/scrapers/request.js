import request from 'request'
import iconv from 'iconv-lite'

export const getDecodedBody = url => new Promise((resolve, reject) => {
  const req = request(url)
  let chunks = []

  req.on('data', chunk => chunks.push(chunk))
  req.on('error', reject)
  req.on('end', (err, res) => {
    if (err) return
    resolve(iconv.decode(Buffer.concat(chunks), 'ISO-8859-1'))
  })
})

export const getBody = url => new Promise((resolve, reject) => {
  const req = request(url, (err, res, body) => {
    if (err) return
    resolve(body)
  })

  req.on('error', reject)
})
