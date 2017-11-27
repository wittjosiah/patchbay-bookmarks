const { h, Value, when, computed, map } = require('mutant')
const nest = require('depnest')

exports.needs = nest({
  'blob.sync.url': 'first',
  'bookmark.obs.bookmark': 'first',
  'feed.html.render': 'first',
  'keys.sync.load': 'first',
  'about.html.link': 'first',
  'bookmark.html.action': 'map',
  'message.html': {
    decorate: 'reduce',
    timestamp: 'first',
  },
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
    if (!msg.value || (msg.value.content.type !== 'bookmark')) return

    const bookmark = api.bookmark.obs.bookmark(msg.key)
    console.log(bookmark())

    const content = [
      h('a', { href: bookmark.messageId }, [
        h('.details', [
          h('Title', bookmark.title),
          h('Description', bookmark.description),
          h('Tags', map(bookmark.tags, tag => h('Tag', tag)))
        ])
      ])
    ]

    const message = h(
      'Message -bookmark',
      [
        h('section.timestamp', {}, api.message.html.timestamp(msg)),
        h('section.content', {}, content),
        h('section.actions', {}, api.bookmark.html.action(msg))
      ]
    )

    const element = h(
      'div',
      { attributes: { tabindex: '0' } },
      message
    )

    return api.message.html.decorate(element, { msg })
  }
}
