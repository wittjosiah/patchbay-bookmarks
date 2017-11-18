const nest = require('depnest')

exports.gives = nest('bookmark.async.title')

exports.needs = nest({
  'sbot.async.publish': 'first',
  'keys.sync.id': 'first'
})

exports.create = function(api) {
  return nest('bookmark.async.title', function({ title, bookmark, public }, cb) {
    if (public) {
      api.sbot.async.publish({ type: 'about', about: bookmark, title }, cb)
    } else {
      const id = api.keys.sync.id()
      api.sbot.async.publish({ type: 'about', about: bookmark, title, recps: [ id ] }, cb)
    }
  })
}
