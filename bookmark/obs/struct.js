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
      title: Value(''),
      description: Value(''),
      messageId: Value(''),
      tags: Set([])
    })

    Object.keys(opts).forEach(k => {
      if (!opts[k]) return

      if (typeof opts[k] === 'function') struct[k] = opts[k]
      else struct[k].set(opts[k])
    })

    struct.save = id => {
      forEachPair(struct, (k, v) => {
        if (api.bookmark.async[k] && v) {
          api.bookmark.async[k]({[k]: v, bookmark: id}, console.log)
        }
      })
    }

    return struct
  })
}
