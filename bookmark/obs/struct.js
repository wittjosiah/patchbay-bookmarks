const nest = require('depnest')
const { Value, Set, Struct, forEachPair } = require('mutant')

exports.needs = nest({
  'bookmark.async': {
    'title': 'first',
    'description': 'first',
    'messageId': 'first',
    'tags': 'first'
  }
})

exports.gives = nest('bookmark.obs.struct')

exports.create = function(api) {
  return nest('bookmark.obs.struct', function(opts = {}) {
    const struct = Struct({
      name: Value(''),
      description: Value(''),
      tags: Set([])
    })

    Object.keys(opts).forEach(k => {
      if (!opts[k]) return

      if (typeof opts[k] === 'function') struct[k] = opts[k]
      else struct[k].set(opts[k])
    })

    struct.save = id => {
      api.bookmark.async.save({
        messageId: id,
        name: struct.name(),
        description: struct.description(),
        tags: struct.tags()
      }, console.log)
    }

    return struct
  })
}
