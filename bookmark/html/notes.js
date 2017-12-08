const nest = require('depnest')
const { h, computed, when } = require('mutant')

exports.needs = nest({
  'message.html.markdown': 'first'
})

exports.gives = nest('bookmark.html.notes')

exports.create = (api) => {
  return nest('bookmark.html.notes', notes)

  function notes ({ notes, isEditing, onUpdate }) {
    const markdown = api.message.html.markdown
    const input = h(
      'textarea',
      {
        'ev-input': e => onUpdate(e.target.value),
        'value': notes 
      }
    )
    return h('Notes', [
      when(
        isEditing,
        input,
        computed(notes, d => d ? markdown(d) : '')
      )
    ])
  }
}
