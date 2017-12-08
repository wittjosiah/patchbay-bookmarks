var nest = require('depnest')

exports.needs = nest({
  'bookmark.html.tagAction': 'first'
})

exports.gives = nest('bookmark.html.action')

exports.create = (api) => {
  return nest('bookmark.html.action', read)
  
  function read(msg) {
    return api.bookmark.html.tagAction('read', 'Read', 'Unread')(msg)
  }
}
