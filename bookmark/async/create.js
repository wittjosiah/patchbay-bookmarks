const nest = require('depnest')

exports.gives = nest('bookmark.async.create')

exports.needs = nest({
  'sbot.async.publish': 'first',
  'keys.sync.id': 'first'
})

exports.create = function(api) {
  return nest('bookmark.async.create', function({ public }, cb) {
    if (public) {
      api.sbot.async.publish({ type: 'bookmark' }, cb)
    } else {
      const id = api.keys.sync.id()
      api.sbot.async.publish({ type: 'bookmark', recps: [ id ] }, cb)
    }
  })
}
