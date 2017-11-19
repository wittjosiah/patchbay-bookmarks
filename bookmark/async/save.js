const nest = require('depnest')

exports.gives = nest('bookmark.async.save')

exports.needs = nest({
  'sbot.async.publish': 'first',
  'keys.sync.id': 'first'
})

exports.create = function(api) {
  return nest('bookmark.async.save', function(data, cb) {
    const { messageId, public, name, description, tags } = data
    const recps = getRecps(api, data.public)
    api.sbot.async.publish({
      type: 'about',
      about: messageId,
      recps,
      name,
      description,
      tags
    }, cb)
  })
}

function getRecps(api, public) {
  if (public) {
    return undefined
  } else {
    return [ api.keys.sync.id() ]
  }
}
