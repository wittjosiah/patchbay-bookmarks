var { h, computed, when } = require('mutant')
var nest = require('depnest')

exports.needs = nest({
  'keys.sync.id': 'first',
  'save.obs.save': 'first',
  'bookmark.html.confirm': 'first'
})

exports.gives = nest('message.html.action')

exports.create = (api) => {
  return nest('message.html.action', msg => {
    var id = api.keys.sync.id()
    var bookmark = api.save.obs.save(msg.key, id)
    var saved = computed([bookmark.tags], tags => isSaved(tags))
    return when(saved,
      h('a.edit', {
        href: '#',
        'ev-click': () => save(msg, bookmark.recps(), bookmark.tags(), bookmark.notes())
      }, 'Edit'),
      h('a.save', {
        href: '#',
        'ev-click': () => save(msg, [ id ], [ 'Reading List' ], '')
      }, 'Save')
    )
  })

  function save (msg, recps, bookmarkTags, notes) {
    var tags = bookmarkTags
    if (!tags || tags.length === 0) {
      tags = [ 'Reading List' ]
    }
    return api.bookmark.html.confirm({
      messageId: msg.key,
      recps,
      notes,
      tags
    }, console.log)
  }
}

function isSaved (tags) {
  if (!tags || !tags.includes) return
  return tags.length > 0 && !tags.includes('Archived')
}
