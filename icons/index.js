
/**
 * This script converts all Tabler icons in node_modules to SVG data URL
 * SCSS functions.
 */

const fs = require('fs')
const { optimize } = require('svgo')

/**
 * Factories
 */

const newIcon = (name, svg) => {
  svg = svg.replace('xmlns="http://www.w3.org/2000/svg"', '#{$xmlns}')
  svg = svg.replaceAll('currentColor', '#{escape-hex($color)}')

  return `\n@function ${name}($color) {\n  @return '#{$scheme}${svg}';\n}\n`
}

const cssClass = name =>
  `\n.${name} {\n  background: url(${name}(#000)) center / 24px 24px no-repeat;\n}\n`

const htmlTag = name =>
  `    <div class="${name}"></div>\n`

/**
 * Gather SVGs, Optimize, and Compile
 */

const entry = './node_modules/@tabler/icons/icons'
const dist = { data: '', css: '', html: '' }

const forEachIcon = callback => {
  fs.readdirSync(entry).forEach(icon => {
    const path = entry + '/' + icon
    fs.statSync(path).isFile() && callback(icon, path)
  })
}

forEachIcon((icon, path) => {
  icon = 'ic-' + icon.replace('.svg', '')

  const svg = optimize(fs.readFileSync(path, 'utf8'), {
    multipass: true,
    plugins: [
      'removeDimensions',
      {
        name: 'removeAttrs',
        params: {
          attrs: '(class)'
        }
      }
    ]
  })

  dist.data += newIcon(icon, svg.data)
  dist.css += cssClass(icon)
  dist.html += htmlTag(icon)
})

/**
 * Output
 */

const cssBanner = '\n@import \'../main\';\n\n[class^=ic-] {\n  width: 48px;\n  height: 48px;\n}\n'
const vars = '\n$scheme: \'data:image/svg+xml;utf8,\';\n$xmlns: \'xmlns="http://www.w3.org/2000/svg"\';\n'
const hexFn = '\n@function escape-hex($hex) {\n  @return \'%23\' + str-slice($hex + \'\', 2);\n}\n'
const banner = vars + hexFn

fs.writeFileSync('icons/main.scss', banner + dist.data)
fs.writeFileSync('icons/src/main.scss', cssBanner + dist.css)
fs.writeFileSync('icons/dist/index.html', `\n\n<html>\n  <link rel="stylesheet" href="/main.css"/>\n  <div style="display: flex; flex-flow: wrap;">\n${dist.html}  </div>\n</html>\n`)
