var { h, computed, when } = require('mutant')
var nest = require('depnest')

exports.needs = nest({
  'bookmark.obs.bookmark': 'first',
  'bookmark.async.tags': 'first'
})

exports.gives = nest('bookmark.html.tag')

exports.create = (api) => {
  return nest('bookmark.html.tag', tag)

  function tag(tagValue, doActionText, undoActionText) {
    return function(msg) {
      var bookmark = api.bookmark.obs.bookmark(msg.key)
      console.log(bookmark())
      var tagged = computed([bookmark.tags, tagValue], isTagged)
      return when(tagged,
        h('a.undoAction', {
          href: '#',
          'ev-click': () => publishAction(msg, bookmark.tags, tagValue, false)
        }, undoActionText),
        h('a.doAction', {
          href: '#',
          'ev-click': () => publishAction(msg, bookmark.tags, tagValue, true)
        }, doActionText)
      )
    }
  }

  function publishAction(msg, tags, tagValue, status = true) {
    var currentTags = tags() || []
    var nextTags
    if (status) {
      nextTags = currentTags
      nextTags.push(tagValue)
    } else {
      nextTags = currentTags.filter(t => t !== tagValue)
    }
    api.bookmark.async.tags({
      bookmark: msg.key,
      tags: [ nextTags ],
      public: true
    }, console.log)
  }
}

function isTagged(tags, tag) {
  return tags.includes(tag)
}