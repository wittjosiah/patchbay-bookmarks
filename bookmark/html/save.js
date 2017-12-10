const { h, computed, when, Value, Struct } = require('mutant')
const nest = require('depnest')

exports.needs = nest({
  'save.async.save': 'first',
  'blob.html.input': 'first',
  'message.html.confirm': 'first',
  'keys.sync.id': 'first'
})

exports.gives = nest('bookmark.html.save')

exports.create = function(api) {
  return nest({ 'bookmark.html.save': create })

  function create() {
    var open = Value(false)
    var bookmark = Struct({
      messageId: Value(),
      notes: Value(),
      tags: Value(),
      public: Value()
    })

    const id = api.keys.sync.id()

    const cancelButton = h('button.cancel', {
      'ev-click': () => open.set(false)
    }, 'Cancel')

    const saveButton = h('button.save', { 'ev-click': () =>
      api.save.async.save({
        recps: bookmark.public() ? null : [ id ],
        messageId: bookmark.messageId(),
        notes: bookmark.notes(),
        tags: bookmark.tags().split(',').map(tag => tag.trim())
      }, console.log)
    }, 'Save')

    const messageInput = h('input.message', {
      placeholder: 'id of message to save',
      'ev-keyup': e => bookmark.messageId.set(e.target.value)
    })

    const notesInput = h('textarea', {
      placeholder: 'notes about message',
      'ev-keyup': e => bookmark.notes.set(e.target.value)
    })

    const tagsInput = h('input.tags', {
      placeholder: 'message tags (comma separated)',
      'ev-keyup': e => bookmark.tags.set(e.target.value)
    })

    const publicState = computed(bookmark.public, public => public)
    const publicInput = h('PublicToggle', { 'ev-click': () => bookmark.public.set(!publicState()) }, [
      h('label', 'Public'),
      h('i', { classList: when(publicState, 'fa fa-check-square-o', 'fa fa-square-o') })
    ])

    const composer = when(
      open,
      h(
        'SaveBookmark',
        [
          h('h2', 'Save a Bookmark'),
          cancelButton,
          saveButton,
          messageInput,
          notesInput,
          tagsInput,
          publicInput
        ]
      ),
      h(
        'SaveBookmarkClosed',
        h('button.open', {
          'ev-click': () => open.set(true)
        }, 'Save a Bookmark')
      )
    )

    return composer
  }
}
