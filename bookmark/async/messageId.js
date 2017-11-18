const nest = require('depnest')

exports.gives = nest('bookmark.async.messageId')

exports.needs = nest({
  'sbot.async.publish': 'first',
  'keys.sync.id': 'first'
})

exports.create = function(api) {
  return nest('bookmark.async.messageId', function({ messageId, bookmark, public }, cb) {
    if (public) {
      api.sbot.async.publish({ type: 'about', about: bookmark, messageId }, cb)
    } else {
      const id = api.keys.sync.id()
      api.sbot.async.publish({ type: 'about', about: bookmark, messageId, recps: [ id ] }, cb)
    }
  })
}
