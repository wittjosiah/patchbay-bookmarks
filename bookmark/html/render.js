const { h, Value, when, computed, map } = require('mutant')
const nest = require('depnest')
const ref = require('ssb-ref')

exports.needs = nest({
  'about.html.avatar': 'first',
  'bookmark.obs.bookmark': 'first',
  'bookmark.html': {
    action: 'map',
    tag: 'first'
  },
  'message.html': {
    author: 'first',
    link: 'first',
    markdown: 'first',
  },
  'keys.sync.id': 'first'
})

exports.gives = nest('bookmark.html.render')

exports.create = function(api) {
  return nest({
    'bookmark.html.render': renderBookmark
  })

  function renderBookmark(msg, { pageId } = {}) {
    const id = api.keys.sync.id()
    const bookmark = api.bookmark.obs.bookmark(msg.key, id)

    const content = [
      h('Saved', [
        h('section.avatar', {}, api.about.html.avatar(msg.value.author)),
        h('section.author', {}, api.message.html.author(msg)),
        h('section.title', {}, messageTitle(msg)),
        h('section.content', {}, messageContent(msg)),
      ])
    ]

    return h(
      'Bookmark',
      { attributes: { tabindex: '0' } },
      [
        h('section.message', {}, content),
        h('section.tags', map(bookmark.tags, tag => api.bookmark.html.tag(tag))),
        h('section.notes', computed([bookmark.notes], messageNotes)),
        h('section.actions', {}, api.bookmark.html.action(msg.key))
      ]
    )
  }

  function messageContent (data) {
    if (!data.value.content || !data.value.content.text) return
    return h('div', {}, api.message.html.markdown(data.value.content))
  }

  function messageTitle (data) {
    var root = data.value.content && data.value.content.root
    return !root ? null : h('span', ['re: ', api.message.html.link(root)])
  }

  function messageNotes (data) {
    console.log(data)
    if (!data) return
    return h('div', {}, [
      h('h4', 'Notes'),
      api.message.html.markdown(data)
    ])
  }
}
