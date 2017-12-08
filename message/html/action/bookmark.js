var { h, computed, when } = require('mutant')
var nest = require('depnest')

exports.needs = nest({
  'keys.sync.id': 'first',
  'bookmark.obs.bookmark': 'first',
  'bookmark.async.save': 'first'
})

exports.gives = nest('message.html.action')

exports.create = (api) => {
  return nest('message.html.action', msg => {
    var id = api.keys.sync.id()
    var bookmark = api.bookmark.obs.bookmark(msg.key, id)
    var saved = computed([bookmark.tags], tags => isSaved(tags))
    return when(saved,
      h('a.archive', {
        href: '#',
        'ev-click': () => save(msg, bookmark.recps(), bookmark.tags(), false)
      }, 'Archive'),
      h('a.save', {
        href: '#',
        'ev-click': () => save(msg, null, [], true)
      }, 'Save')
    )
  })

  function save (msg, recps, bookmarkTags, status = true) {
    var currentTags = bookmarkTags || []
    var tags
    if (status) {
      if (currentTags.includes('Archived')) {
        tags = currentTags.filter(t => t !== 'Archived')
      } else {
        tags = currentTags
      }
      tags.push('Reading List')
    } else {
      tags = currentTags
      tags.push('Archived')
    }

    var notes = ""
    if (msg.value && msg.value.content && msg.value.content.text) {
      notes = msg.value.content.text.substring(0, 30) + "..."
    }

    api.bookmark.async.save({
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
