const nest = require('depnest')
const { computed, map, h } = require('mutant')

exports.gives = nest({
  'app.page.tag': true
})

exports.needs = nest({
  'keys.sync.id': 'first',
  'message.html.render': 'first',
  'tag.obs.taggedMessages': 'first'
})

exports.create = function(api) {
  return nest({ 'app.page.tag': tagPage })

  function tagPage(path) {
    const tagId = path
    const tag = api.tag.async.get(tagId)
    if (!tag) return

    const myId = api.keys.sync.id()
    const tagMessages = api.tag.obs.taggedMessages(myId, tagId)

    return h('Page', [
      h('section', [
        map(tagMessages, msg => {
          return computed(msg, msg => {
            if (msg && !msg.value.missing) {
              api.message.html.render(msg)
            }
          })
        })
      ])
    ])
  }
}
