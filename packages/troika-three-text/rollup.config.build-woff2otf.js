// This build file creates a static version of the Typr.ts library used for
// processing fonts. It's isolated within a "factory" function wrapper so it can
// easily be marshalled into a web worker.


import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'


const {LERNA_ROOT_PATH} = process.env
if (!LERNA_ROOT_PATH) {
  throw new Error("Please execute `npm run build-typr` from the repository root.")
}


const OUTPUT_TEMPLATE = `
/*!
Custom bundle of woff2otf (https://github.com/arty-name/woff2otf) with tiny-inflate 
(https://github.com/foliojs/tiny-inflate) for use in Troika text rendering. 
Original licenses apply: 
- tiny-inflate: https://github.com/foliojs/tiny-inflate/blob/master/LICENSE (MIT)
- woff2otf.js: https://github.com/arty-name/woff2otf/blob/master/woff2otf.js (Apache2)
*/

export default function() {
  $$CONTENT$$

  return woff2otf.convert_streams
}
`

const [banner, footer] = OUTPUT_TEMPLATE.split('$$CONTENT$$')


export default {
  // Starting from the src modules rather than dist as that gives us more fine-grained control
  input: 'src/woff2otf.js',
  plugins: [
    nodeResolve(),
    commonjs(),
    terser({
      ecma: 5
    })
  ],
  output: {
    format: 'iife',
    name: 'woff2otf',
    file: 'libs/woff2otf.factory.js',
    banner,
    footer
  }
}
