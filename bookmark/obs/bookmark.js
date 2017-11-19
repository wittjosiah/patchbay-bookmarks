const nest = require('depnest')
const pull = require('pull-stream')
const ref = require('ssb-ref')
const { computed } = require('mutant')

exports.needs = nest({
  'about.obs.latestValue': 'first',
  'about.obs.valueFrom': 'first',
  'bookmark.obs.struct': 'first',
  'keys.sync.id': 'first'
})

exports.gives = nest('bookmark.obs.bookmark')

exports.create = function(api) {
  return nest('bookmark.obs.bookmark', function(messageId) {
    if (!ref.isLink(messageId)) throw new Error('an id must be specified')

    const { latestValue, valueFrom } = api.about.obs
    const id = api.keys.sync.id()

    const bookmark = api.bookmark.obs.struct({
      name: latestValue(messageId, 'name'),
      description: latestValue(messageId, 'description'),
      tags: computed([groupedValues(messageId, 'tags')], Object.keys)
    })

    return bookmark
  })
}
