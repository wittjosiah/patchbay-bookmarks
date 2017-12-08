
var { h, map } = require('mutant')
var nest = require('depnest')

exports.needs = nest({
  'bookmark.html.tag': 'first'
})

exports.gives = nest('bookmark.html.tags')

exports.create = (api) => {
  return nest('bookmark.html.tags', tags =>
    h('Tags', [
      h('h2', 'Tags'),
      h('div', [
        api.bookmark.html.tag("readinglist", "Reading List"),
        api.bookmark.html.tag("read", "Read"),
        api.bookmark.html.tag("favourite", "Favourites"),
        api.bookmark.html.tag("archived", "Archived")
      ]),
      h('div', map(tags, tag => api.bookmark.html.tag(tag)))
    ])
  )
}
