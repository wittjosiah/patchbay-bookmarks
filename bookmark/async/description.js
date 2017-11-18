const nest = require('depnest')

exports.gives = nest('bookmark.async.description')

exports.needs = nest({
  'sbot.async.publish': 'first',
  'keys.sync.id': 'first'
})

exports.create = function(api) {
  return nest('bookmark.async.description', function({ description, bookmark, public }, cb) {
    if (public) {
      api.sbot.async.publish({ type: 'about', about: bookmark, description }, cb)
    } else {
      const id = api.keys.sync.id()
      api.sbot.async.publish({ type: 'about', about: bookmark, description, recps: [ id ] }, cb)
    }
  })
}
