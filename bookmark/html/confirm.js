const nest = require('depnest')
const lightbox = require('hyperlightbox')
const { h, Value, computed } = require('mutant')

exports.gives = nest('bookmark.html.confirm')

exports.needs = nest({
  'bookmark.async.save': 'first',
  'bookmark.html': {
    notes: 'first',
    tags: 'first'
  },
  message: {
    'async.publish': 'first',
    'html.render': 'first'
  },
  'keys.sync.id': 'first'
})

exports.create = function (api) {
  return nest({
    'bookmark.html': { confirm }
  })

  function confirm (content, cb) {
    cb = cb || function () {}

    var lb = lightbox()
    document.body.appendChild(lb)

    const tagString = Value(content.tags.join(','))
    const tags = computed([tagString], x => 
      x.split(',').map(t => t.trim())
    )
    const notes = Value(content.notes)
    const isEditing = Value(true)

    var okay = h('button.save', {
      'ev-click': () => {
        lb.remove()
        api.bookmark.async.save({
          messageId: content.messageId,
          recps: content.recps,
          tags: tags(),
          notes: notes()
        }, cb)
      }},
      'save'
    )

    var cancel = h('button.cancel', {
      'ev-click': () => {
        lb.remove()
        cb(null)
      }},
      'cancel'
    )

    okay.addEventListener('keydown', (ev) => {
      if (ev.keyCode === 27) cancel.click() // escape
    })

    lb.show(h('SaveConfirm', [
      h('section -tags', [
        h('h4', 'Tags'),
        api.bookmark.html.tags(tags, isEditing, t => tagString.set(t))
      ]),
      h('section -notes', [
        h('h4', 'Notes'),
        api.bookmark.html.notes(notes, isEditing, n => notes.set(n))
      ]),
      h('section -actions', [cancel, okay])
    ]))

    okay.focus()
  }
}
