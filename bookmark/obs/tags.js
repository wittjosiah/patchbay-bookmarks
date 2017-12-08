var {Value, computed} = require('mutant')
var pull = require('pull-stream')
var nest = require('depnest')
var ref = require('ssb-ref')

exports.needs = nest({
  'sbot.pull.stream': 'first',
  'keys.sync.id': 'first'
})

exports.gives = nest({
  'bookmark.obs': [
    'taggedMessages',
    'tagsFrom'
  ]
})

exports.create = function (api) {
  var syncValue = Value(false)
  var sync = computed(syncValue, x => x)
  var cache = null

  return nest({
    'bookmark.obs': {
      taggedMessages,
      tagsFrom
    }
  })

  function taggedMessages (author, key) {
    if (!ref.isLink(author)) throw new Error('Requires an ssb ref!')
    return withSync(computed([get(author), key], getTaggedMessages))
  }

  function tagsFrom (author) {
    if (!ref.isLink(author)) throw new Error('Requires an ssb ref!')
    return withSync(computed([get(author)], getTagsFrom))
  }

  function withSync (obs) {
    obs.sync = sync
    return obs
  }

  function get (author) {
    if (!ref.isLink(author)) throw new Error('Requires an ssb ref!')
    load()
    if (!cache[author]) {
      cache[author] = Value({})
    }
    return cache[author]
  }

  function load () {
    if (!cache) {
      cache = {}
      pull(
        api.sbot.pull.stream(sbot => sbot.about.tagsStream({ live: true })),
        pull.drain(item => {
          console.log('ITEM', item)
          for (var author in item) {
            var state = get(author)
            var lastState = state()
            var tags = item[author]['tags']
            var changes = false
            for (var tag in tags) {
              var msgsForTag = lastState[tag] = lastState[tag] || {}
              for (var msg in tags[tag]) {
                var timestamp = tags[tag][msg]
                if (!msgsForTag[msg] || timestamp > msgsForTag[msg]) {
                  msgsForTag[msg] = timestamp
                  changed = true
                }
              }
            }
            if (changed) {
              state.set(lastState)
            }
          }
          if (!syncValue()) {
            syncValue.set(true)
          }
        })
      )
    }
  }
}

function getTaggedMessages(lookup, key) {
  const messages = [];
  for(const msg in lookup[key]) {
    if (lookup[key][msg]) {
      messages.push(msg)
    }
  }
  return messages
}

function getTagsFrom(lookup) {
  const tags = []
  for (const tag in lookup) {
    var valid = false
    for (const msg in lookup[tag]) {
      if (lookup[tag][msg]) {
        valid = true
      }
    }
    if (valid) {
      tags.push(tag)
    }
  }
  return tags
}
