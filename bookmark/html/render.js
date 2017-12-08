const { h, Value, when, computed, map } = require('mutant')
const nest = require('depnest')
const ref = require('ssb-ref')

exports.needs = nest({
  'bookmark.obs.bookmark': 'first',
  'bookmark.html': {
    'action': 'map',
    'tag': 'first'
  },
  'message.html': {
    decorate: 'reduce',
    timestamp: 'first',
  },
  'keys.sync.id': 'first'
})

exports.gives = nest({
  // 'message.html': [ 'render' ],
  'bookmark.html': [ 'render' ]
})

exports.create = function(api) {
  return nest({
    // 'message.html.render': renderBookmark,
    'bookmark.html.render': renderBookmark
  })

  function renderBookmark(msg, { pageId } = {}) {
    const id = api.keys.sync.id()
    const bookmark = api.bookmark.obs.bookmark(msg.key, id)
    const message = api.message.html.render(msg)

    const content = [
      h('Details', [
        h('div.notes', bookmark.notes),
        h('div.tags', map(bookmark.tags, tag => api.bookmark.html.tag(tag))),
        message
      ])
    ]

    const view = h(
      'Bookmark',
      [
        h('section.timestamp', {}, api.message.html.timestamp(msg)),
        h('section.content', {}, content),
        h('section.actions', {}, api.bookmark.html.action(msg.key))
      ]
    )

    const element = h(
      'div',
      { attributes: { tabindex: '0' } },
      view
    )

    return api.message.html.decorate(element, { msg })
  }
}
