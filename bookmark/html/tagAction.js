var { h, computed, when } = require('mutant')
var nest = require('depnest')

exports.needs = nest({
  'bookmark.obs.bookmark': 'first',
  'bookmark.async.save': 'first',
  'keys.sync.id': 'first'
})

exports.gives = nest('bookmark.html.tagAction')

exports.create = (api) => {
  return nest('bookmark.html.tagAction', tag)

  function tag(tagValue, doActionText, undoActionText) {
    return function(msgId) {
      const id = api.keys.sync.id()
      var bookmark = api.bookmark.obs.bookmark(msgId, id)
      var tagged = computed([bookmark.tags, tagValue], isTagged)
      return when(tagged,
        h('button.undoAction', {
          'ev-click': () => publishAction(msgId, bookmark.recps(), bookmark.tags(), tagValue, false)
        }, undoActionText),
        h('button.doAction', {
          'ev-click': () => publishAction(msgId, bookmark.recps(), bookmark.tags(), tagValue, true)
        }, doActionText)
      )
    }
  }

  function publishAction(messageId, recps, bookmarkTags, tagValue, status = true) {
    var currentTags = bookmarkTags || []
    var tags
    if (status) {
      tags = currentTags
      tags.push(tagValue)
    } else {
      tags = currentTags.filter(t => t !== tagValue)
    }
    api.bookmark.async.save({ recps, messageId, tags }, console.log)
  }
}

function isTagged(tags, tag) {
  if (!tags) return
  return tags.includes(tag)
}