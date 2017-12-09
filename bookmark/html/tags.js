
var { h, map, when } = require('mutant')
var nest = require('depnest')

exports.needs = nest({
  'bookmark.html.tag': 'first'
})

exports.gives = nest('bookmark.html.tags')

exports.create = (api) => {
  return nest('bookmark.html.tags', (tags, isEditing, onUpdate) =>
    h('Tags',
      when(isEditing,
        h('input', {
          placeholder: 'message tags (comma separated)',
          'ev-keyup': e => onUpdate(e.target.value),
          value: tags().join(",")
        }),
        map(tags, tag => api.bookmark.html.tag(tag))
      )
    )
  )
}
