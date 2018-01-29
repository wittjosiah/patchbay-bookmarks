var nest = require('depnest')
var { h } = require('mutant')

exports.gives = nest('tag.html.render')

exports.create = function(api) {
  return nest('tag.html.render', tag =>
    h('a', { href: tag.key }, h('Tag', tag.name))
  )
}
