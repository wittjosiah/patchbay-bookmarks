const bulk = require('bulk-require')

const modules = bulk(__dirname, ['!(node_modules|test.js|*.test.js)/**/*.js'], {require: function (module) {
  return module.match(/(.*.test.js$)/) ? null : require(module)
}})

module.exports = modules
