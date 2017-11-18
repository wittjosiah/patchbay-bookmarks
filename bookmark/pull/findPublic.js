const nest = require('depnest')
const pull = require('pull-stream')

exports.gives = nest('bookmark.pull.findPublic')

exports.needs = nest({
  'sbot.pull.messagesByType': 'first'
})

exports.create = function(api) {
  const { messagesByType } = api.sbot.pull

  return nest({ 'bookmark.pull.findPublic': find })

  function find(opts) {
    const _opts = Object.assign(
      {},
      {
        live: true,
        future: true,
        past: false
      },
      opts,
      { type: 'bookmark' }
    )
    return pull(
      messagesByType(_opts),
      pull.filter(bookmark => bookmark)
    )
  }
}
