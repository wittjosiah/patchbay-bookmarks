const nest = require('depnest')
const pull = require('pull-stream')

exports.gives = nest('bookmark.async.tags')

exports.needs = nest({
  'sbot.async.publish': 'first',
  'keys.sync.id': 'first'
})

exports.create = function(api) {
  return nest('bookmark.async.tags', function(data, cb) {
    console.log(data.tags)
    pull(
      pull.values(data.tags),
      pull.asyncMap((tags, cb) => {
        if (data.public) {
          api.sbot.async.publish({
            type: 'about',
            about: data.bookmark,
            tags: tags
          }, cb)
        } else {
          const id = api.keys.sync.id()
          api.sbot.async.publish({
            type: 'about',
            about: data.bookmark,
            tags: tags,
            recps: [ id ]
          }, cb)
        }
      }),
      pull.collect(cb)
    )
  })
}
