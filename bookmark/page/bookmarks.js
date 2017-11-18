const nest = require('depnest')
const pull = require('pull-stream')
const { h , Array } = require('mutant')
const Scroller = require('pull-scroll')
const ref = require('ssb-ref')

const next = require('../../../patchbay/junk/next-stepper')

exports.gives = nest({
  'app.html.menuItem': true,
  'app.page.bookmarks': true,
})

exports.needs = nest({
  'app.html.scroller': 'first',
  'bookmark.html': {
    create: 'first',
    render: 'first'
  },
  'keys.sync.id': 'first',
  'bookmark.pull.findPublic': 'first',
})

exports.create = function(api) {
  return nest({
    'app.html.menuItem': menuItem,
    'app.page.bookmarks': bookmarksPage,
  })

  function menuItem(handleClick) {
    return h('a', {
      style: { order: 0 },
      'ev-click': () => handleClick({ page: 'bookmarks' })
    }, '/bookmarks')
  }
  
  function bookmarksPage(path) {
    const id = api.keys.sync.id()

    console.log('path', path)
    const creator = api.bookmark.html.create({})
    const { container, content } = api.app.html.scroller({
      prepend: [ creator ]
    })

    pull(
      api.bookmark.pull.findPublic({ old: false }),
      Scroller(container, content, api.bookmark.html.render, true, false)
    )

    pull(
      api.bookmark.pull.findPublic({ reverse: true }),
      Scroller(container, content, api.bookmark.html.render, false, false)
    )

    container.title = '/bookmarks'
    return container
  }
}
