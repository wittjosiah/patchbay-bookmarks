const nest = require('depnest')
const pull = require('pull-stream')
const ref = require('ssb-ref')
const { computed } = require('mutant')

exports.needs = nest({
  'about.obs.latestValue': 'first',
  'about.obs.valueFrom': 'first',
  'about.obs.groupedValues': 'first',
  'bookmark.obs.struct': 'first'
})

exports.gives = nest('bookmark.obs.bookmark')

exports.create = function(api) {
  return nest('bookmark.obs.bookmark', function(messageId, id) {
    if (!ref.isLink(messageId)) throw new Error('an id must be specified')

    const { latestValue, valueFrom, groupedValues } = api.about.obs

    const bookmark = api.bookmark.obs.struct({
      notes: latestValue(messageId, 'notes'),
      tags: valueFrom(messageId, 'tags', id),
      recps: latestValue(messageId, 'recps')
    })

    return bookmark
  })
}
