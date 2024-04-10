import * as fsp from 'node:fs/promises'

const filePath = './build/mac/nitro-app-dev.app/Contents/Resources/socket/service-worker/container.js'


const contents = await fsp.readFile(filePath, 'utf-8')

const fixed = contents.replace('serviceWorker.addEventListener', 'globalThis.addEventListener')

await fsp.writeFile(filePath, fixed, 'utf-8')