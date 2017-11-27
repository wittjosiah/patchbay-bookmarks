var nest = require('depnest')

exports.needs = nest({
  'bookmark.html.tag': 'first'
})

exports.gives = nest('bookmark.html.action')

exports.create = (api) => {
  return nest('bookmark.html.action', favourite)
  
  function favourite(msg) {
    return api.bookmark.html.tag('favourite', 'Favourite', 'Unfavourite')(msg)
  }
}
