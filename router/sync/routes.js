const nest = require('depnest')

exports.gives = nest('router.sync.routes')

exports.needs = nest({
  'app.page.tags': 'first',
})

exports.create = (api) => {
  return nest('router.sync.routes', (sofar = []) => {
    const pages = api.app.page

    // loc = location
    const routes = [
      [ loc => loc.page === 'tags', pages.tags ],
    ]

    return [...routes, ...sofar]
  })
}
