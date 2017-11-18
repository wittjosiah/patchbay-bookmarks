const { h, Value, when, computed } = require('mutant')
const nest = require('depnest')

exports.needs = nest({
  'blob.sync.url': 'first',
  'bookmark.obs.bookmark': 'first',
  'feed.html.render': 'first',
  'keys.sync.load': 'first',
  'about.html.link': 'first',
  'about.html.image': 'first',
  'message.html': {
    decorate: 'reduce',
    link: 'first',
    markdown: 'first',
    backlinks: 'first',
    meta: 'map',
    action: 'map',
    timestamp: 'first',
  },
})

exports.gives = nest({
  'message.html': [ 'render' ],
  'bookmark.html': [ 'render' ]
})

exports.create = function(api) {
  const { timestamp, meta, backlinks, action } = api.message.html

  return nest({
    'message.html.render': renderBookmark,
    'bookmark.html.render': renderBookmark
  })

  function renderBookmark(msg, { pageId } = {}) {
    if (!msg.value || (msg.value.content.type !== 'bookmark')) return

    const bookmark = api.bookmark.obs.bookmark(msg.key)

    const content = [
      h('a', { href: bookmark.messageId }, [
        h('.details', [
          h('Title', bookmark.title),
          h('Description', bookmark.description),
          h('Tags', bookmark.tags().map(tag =>
            h('Tag', tag)
          ))
        ])
      ])
    ]

    const message = h(
      'Message -bookmark',
      [
        h('section.avatar', {}, api.about.html.image(msg.value.author)),
        h('section.timestamp', {}, timestamp(msg)),
        h('section.meta', {}, meta(msg)),
        h('section.content', {}, content),
        h('section.actions', {}, action(msg)),
        h('footer.backlinks', {}, backlinks(msg))
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
