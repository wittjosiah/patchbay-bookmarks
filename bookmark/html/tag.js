var { h } = require('mutant')
var nest = require('depnest')

exports.needs = nest({
  'app.sync.goTo': 'first'
})

exports.gives = nest('bookmark.html.tag')

exports.create = (api) => {
  return nest('bookmark.html.tag', tag =>
    h('Tag', {
      'ev-click': () => api.app.sync.goTo({ page: 'bookmarks', tag: tag })
    }, tag)
  )
}
