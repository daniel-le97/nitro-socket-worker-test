
import * as fsp from "node:fs/promises"
const file = await fsp.readFile('./build/mac/nitro-app-dev.app/Contents/Resources/server/index.mjs', 'utf-8')

const contents = file.replace('_global.process = _global.process || process$1;', '').replace('const process = _global.process;', 'const process = _global.process || process$1;')

await fsp.writeFile('./build/mac/nitro-app-dev.app/Contents/Resources/server/index.mjs', contents, 'utf-8')