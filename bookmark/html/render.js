const { h, Struct, Value, when, computed, map } = require('mutant')
const nest = require('depnest')
const ref = require('ssb-ref')

exports.needs = nest({
  'about.html.avatar': 'first',
  'save.obs': {
    save: 'first',
    struct: 'first'
  },
  'bookmark.html': {
    action: 'map',
    notes: 'first',
    tags: 'first'
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

  return nest({ 'bookmark.html.render': renderBookmark })

  function renderBookmark(msg, { pageId } = {}) {
    const id = api.keys.sync.id()
    const bookmark = api.save.obs.save(msg.key, id)
    const edited = api.save.obs.struct()
    for (var i in bookmark.recps()) {
      edited.recps.add(bookmark.recps()[i])
    }
    for (var i in bookmark.tags()) {
      edited.tags.add(bookmark.tags()[i])
    }
    edited.notes.set(bookmark.notes())
    const isEditing = Value(false)

    const content = [
      h('Saved', [
        h('section.avatar', {}, api.about.html.avatar(msg.value.author)),
        h('section.author', {}, api.message.html.author(msg)),
        h('section.title', {}, messageTitle(msg)),
        h('section.content', {}, messageContent(msg)),
      ])
    ]

    const editToggle = h('button.edit', {
      'ev-click': () => isEditing.set(!isEditing())
    }, when(isEditing, 'Cancel', 'Edit'))

    const saveButton = when(isEditing,
      h('button.save', {
        'ev-click': () => {
          edited.save(msg.key)
          isEditing.set(false)
        }
      }, 'Save'),
      null
    )

    return h(
      'Bookmark',
      { attributes: { tabindex: '0' } },
      [
        h('section.message', content),
        h('section.tags',
          api.bookmark.html.tags(
            bookmark.tags,
            isEditing,
            tags => {
              edited.tags.clear()
              const toAdd = tags.split(',').map(t => t.trim())
              for(var i in toAdd) {
                edited.tags.add(toAdd[i])
              }
            }
          )
        ),
        h('section.notes', [
          h('h4', 'Notes'),
          api.bookmark.html.notes(
            bookmark.notes,
            isEditing,
            notes => edited.notes.set(notes)
          )
        ]),
        h('section.actions', when(isEditing, null, api.bookmark.html.action(msg.key))),
        editToggle,
        saveButton
      ]
    )
  }

  function messageContent(data) {
    if (!data.value.content || !data.value.content.text) return
    return h('div', {}, api.message.html.markdown(data.value.content))
  }

  function messageTitle(data) {
    var root = data.value.content && data.value.content.root
    return !root ? null : h('span', ['re: ', api.message.html.link(root)])
  }
}
