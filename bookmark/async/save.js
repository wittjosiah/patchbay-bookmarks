const nest = require('depnest')

exports.gives = nest('bookmark.async.save')

exports.needs = nest({
  'sbot.async.publish': 'first',
  'keys.sync.id': 'first'
})

exports.create = function(api) {
  return nest('bookmark.async.save', function(data, cb) {
    const { messageId, recps, notes, tags } = data
    api.sbot.async.publish({
      type: 'about',
      about: messageId,
      recps,
      notes,
      tags
    }, cb)
  })
}
