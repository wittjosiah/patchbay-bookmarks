const nest = require('depnest')
const pull = require('pull-stream')
const ref = require('ssb-ref')
const { computed } = require('mutant')

exports.needs = nest({
  'about.obs.latestValue': 'first',
  'about.obs.groupedValues': 'first',
  'bookmark.obs.struct': 'first'
})

exports.gives = nest('bookmark.obs.bookmark')

exports.create = function(api) {
  return nest('bookmark.obs.bookmark', function(bookmarkId) {
    if (!ref.isLink(bookmarkId)) throw new Error('an id must be specified')

    const { latestValue, groupedValues } = api.about.obs

    const bookmark = api.bookmark.obs.struct({
      title: latestValue(bookmarkId, 'title'),
      description: latestValue(bookmarkId, 'description'),
      messageId: latestValue(bookmarkId, 'messageId'),
      tags: computed([groupedValues(bookmarkId, 'tags')], Object.keys)
    })

    return bookmark
  })
}
