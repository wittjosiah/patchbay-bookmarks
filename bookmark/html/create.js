const { h, computed, when, Value, Struct } = require('mutant')
const nest = require('depnest')

exports.needs = nest({
  'bookmark.async': {
    create: 'first',
    messageId: 'first',
    title: 'first',
    description: 'first',
    tags: 'first'
  },
  'blob.html.input': 'first',
  'message.html.confirm': 'first'
})

exports.gives = nest('bookmark.html.create')

exports.create = function(api) {
  return nest({ 'bookmark.html.create': create })

  function create() {
    var bookmark = Struct({
      messageId: Value(),
      title: Value(),
      description: Value(),
      tags: Value(),
      public: Value()
    })

    const createButton = h('button', { 'ev-click': () =>
      api.bookmark.async.create({ public: bookmark.public() }, function(err, msg) {
        api.bookmark.async.messageId({
          bookmark: msg.key,
          messageId: bookmark.messageId(),
          public: bookmark.public()
        })
        api.bookmark.async.title({
          bookmark: msg.key,
          title: bookmark.title(),
          public: bookmark.public()
        })
        api.bookmark.async.description({
          bookmark: msg.key,
          description: bookmark.description(),
          public: bookmark.public()
        })
        api.bookmark.async.tags({
          bookmark: msg.key,
          tags: [ bookmark.tags().split(',').map(tag => tag.trim()) ],
          public: bookmark.public()
        }, console.log)
      })
    }, 'Save')

    const messageInput = h('input.message', {
      placeholder: 'id of message to save',
      'ev-keyup': e => bookmark.messageId.set(e.target.value)
    })

    const titleInput = h('input.title', {
      placeholder: 'title of message',
      'ev-keyup': e => bookmark.title.set(e.target.value)
    })

    const descriptionInput = h('textarea', {
      placeholder: 'description of message',
      'ev-keyup': e => bookmark.description.set(e.target.value)
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

    const composer = h('CreateBookmark', [
      h('h2', 'Create a Bookmark'),
      createButton,
      messageInput,
      titleInput,
      descriptionInput,
      tagsInput,
      publicInput
    ])

    return composer
  }
}
