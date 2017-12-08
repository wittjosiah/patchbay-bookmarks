
var { h, map } = require('mutant')
var nest = require('depnest')

exports.needs = nest({
  'bookmark.html.tag': 'first'
})

exports.gives = nest('bookmark.html.tags')

exports.create = (api) => {
  return nest('bookmark.html.tags', tags =>
    h('Tags', [
      h('h2', "Tags"),
      h('div', map(tags, tag => api.bookmark.html.tag(tag)))
    ])
  )
}
