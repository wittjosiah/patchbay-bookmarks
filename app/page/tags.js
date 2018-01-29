const nest = require('depnest')
const { computed, map, h } = require('mutant')

exports.gives = nest({
  'app.html.menuItem': true,
  'app.page.tags': true,
})

exports.needs = nest({
  'keys.sync.id': 'first',
  'tag.html.render': 'first',
  'tag.obs.get': 'first',
  'tag.obs.allTagsFrom': 'first'
})

exports.create = function(api) {
  return nest({
    'app.html.menuItem': menuItem,
    'app.page.tags': tagsPage,
  })

  function menuItem(handleClick) {
    return h('a', {
      style: { order: 0 },
      'ev-click': () => handleClick({ page: 'tags' })
    }, '/tags')
  }
  
  function tagsPage(path) {
    if (path.page !== ('tags')) return

    const myId = api.keys.sync.id()
    const tags = map(
      api.tag.obs.allTagsFrom(myId),
      tagId => api.tag.obs.get(tagId)
    )

    return h('Page', [
      h('section', [
        map(
          tags,
          tag => computed(tag, tag => api.tag.html.render(tag))
        )
      ])
    ])
  }
}
