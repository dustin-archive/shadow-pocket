
/**
 *
 * This module breaks the fourth wall.
 * Ideadly this would be a plugin or something created in userland.
 *
 */

const esbuild = require('esbuild')
const config = require('../../build/config')

const script = function (error) {
  return `
const style = document.createElement('style')
const div = document.createElement('div')

style.innerHTML = \`
.wrapper {
  display: flex;
  position: fixed;
  top: 0; right: 0; bottom: 0; left: 0;
  padding: 24px;
}
.wrapper > div {
  margin: auto;
  padding: 24px;
  color: #fff;
  font: 14px/24px sans-serif;
  white-space: pre;
  background: #000;
}\`

div.classList.add('wrapper')
div.innerHTML = \`<div>${error}\nSee terminal for full stack trace.</div>\`

document.head.appendChild(style)
document.body.appendChild(div)
`
}

let result

async function init () {
  result = await esbuild.build({
    ...config.esbuild.js,
    incremental: true
  })
}

init()

module.exports = function (callback) {
  result.rebuild()
    .then(function (data) {
      data = data.outputFiles[0].contents.buffer
      data = Buffer.from(data).toString()
      callback(data)
    })
    .catch(function (error) {
      callback(script(error))
      console.log(error)
    })
}
