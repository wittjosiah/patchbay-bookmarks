const nest = require('depnest')
const pull = require('pull-stream')
const { h , Array, Value, computed, when } = require('mutant')
const Scroller = require('pull-scroll')
const ref = require('ssb-ref')

const next = require('../../../patchbay/junk/next-stepper')

exports.gives = nest({
  'app.html.menuItem': true,
  'app.page.bookmarks': true,
})

exports.needs = nest({
  'app.html.scroller': 'first',
  'app.sync.goTo': 'first',
  'bookmark.pull.find': 'first',
  'bookmark.obs': {
    'tagsFrom': 'first',
    'taggedMessages': 'first'
  },
  'bookmark.html': {
    save: 'first',
    render: 'first',
    tags: 'first'
  },
  'keys.sync.id': 'first'
})

exports.create = function(api) {
  return nest({
    'app.html.menuItem': menuItem,
    'app.page.bookmarks': bookmarksPage,
  })

  function menuItem(handleClick) {
    return h('a', {
      style: { order: 0 },
      'ev-click': () => handleClick({ page: 'bookmarks', tag: 'toread' })
    }, '/bookmarks')
  }
  
  function bookmarksPage(path) {
    const id = api.keys.sync.id()
    const tag = path['tag'] || 'toread'

    const creator = api.bookmark.html.save({})
    const tagSelector = api.bookmark.html.tags(api.bookmark.obs.tagsFrom(id))
    const currentTag = h('h2', tag)
    const { container, content } = api.app.html.scroller({
      prepend: [ creator, tagSelector, currentTag ]
    })

    pull(
      api.bookmark.pull.find(),
      pull.map(index => {
        const msgs = []
        for (const msg in index[id]['tags'][tag]) {
          msgs.push({
            key: msg,
            value: {
              content: {},
              timestamp: index[id]['tags'][tag][msg]
            }
          })
        }
        msgs.sort((a, b) => a.value.timestamp < b.value.timestamp)
        return msgs
      }),
      pull.flatten(),
      Scroller(container, content, api.bookmark.html.render, false, false)
    )

    container.title = '/bookmarks/' + tag
    return container
  }
}
