<script>

import * as Debug from 'debug'
const debug = Debug('components:mixins:DataSources')

// import dataStore from 'src/store/data'
import sourceStore from 'src/store/source'

import { EventBus } from '@libs/eventbus'

import { mapState, mapGetters } from 'vuex'

let qs = require('qs')

export default {
  name: 'data-sources',

  components: {

  },

  pipelines: {},

  // sources: {
  //   data: {},
  //   stat: {},
  //   tabular: {}
  // },

  data () {
    return {
      id: undefined,
      store: false

    }
  },

  watch: {
    store: function (val) {
      debug('watch store', val)
      if (val) this.__register_store_module(this.id, sourceStore)
    }
  },
  created: function () {
    debug('created')
    EventBus.$on(this.id, this.__process_data.bind(this))

    if (this.store) this.__register_store_module(this.id, sourceStore)
  },

  mounted: function () {
    debug('mounted')
    this.create_pipelines()
  },
  updated: function () {
  },
  destroy: function () {
    this.__unregister_store_module(this.id)
  },

  // computed: mapState({
  //
  //   'periodical?register=periodical&transformation=limit%3A30000.range' (state) {
  //     debug('computed', state[this.id + '_sources']['periodical?register=periodical&transformation=limit%3A30000'])
  //     return (state[this.id + '_sources']['periodical?register=periodical&transformation=limit%3A30000']) ? state[this.id + '_sources']['periodical?register=periodical&transformation=limit%3A30000'].range : undefined
  //   }
  // }),
  // computed: {
  //   // mix the getters into computed with object spread operator
  //   ...mapGetters([
  //     'doneTodosCount',
  //     'anotherGetter',
  //     // ...
  //   ])
  // }
  methods: {
    __update_component_data: function (component, key, data) {
      debug('__update_component_data', component)
      let callback = this.__get_source_callback_from_key(component.source, key)

      debug('__update_component_data', callback)

      if (callback && typeof callback === 'function') {
        callback.attempt(data, component)
      }
    },
    __get_source_callback_from_key: function (source, key) {
      let callback

      for (const type in source) {
        for (const req_type in source[type]) {
          let reqs = source[type][req_type]
          if (!Array.isArray(reqs)) reqs = [reqs]

          for (let i = 0; i < reqs.length; i++) {
            if (this.__query_to_key(reqs[i].params) === key) {
              debug('__get_source_callback_from_key', reqs)
              callback = reqs[i].callback
            }
          }
        }
      }

      return callback
    },
    __source_to_keys: function (source) {
      let keys = []
      for (const type in source) {
        for (const req_type in source[type]) {
          let reqs = source[type][req_type]
          if (!Array.isArray(reqs)) reqs = [reqs]

          for (let i = 0; i < reqs.length; i++) {
            keys.push(this.__query_to_key(reqs[i].params))
          }
        }
      }

      return keys
    },
    __query_to_key: function (query) {
      if (typeof query === 'string') {
        return query
      } else {
        let _query = Object.merge(query.query, query.body)
        debug('__query_to_string', this.id + '?' + qs.stringify(_query))
        return query.path + '?' + qs.stringify(_query)
      }
    },

    __register_store_module: function (id, module) {
      debug('__register_store_module', id)

      // if (!process.env.DEV) { if (old && this.$store.state['data_sources_' + old]) { this.$store.unregisterModule('data_sources_' + old) } }
      // if (old && this.$store.state['dashboard_' + old]) { this.$store.unregisterModule('dashboard_' + old) }

      if (id && !this.$store.state[id + '_sources']) { this.$store.registerModule(id + '_sources', Object.clone(module)) }

      // this.$store.commit(this.id + '_sources/add', { id: 'periodical?register=periodical&transformation=limit%3A30000', data: { range: [] } })

      // this.$store.watch((state) => state[this.id + '_sources']['periodical?register=periodical&transformation=limit%3A30000'], (val, oldVal) => {
      //   // if (!this.components_data['periodical?register=periodical&transformation=limit%3A30000']) { this.$set(this.components_data, 'periodical?register=periodical&transformation=limit%3A30000', {}) }
      //
      //   debug('watcher', val)
      //   if (val['range']) {
      //     for (const index in val['range']) {
      //       this.$set(this.components['6'][0].options.range, index, val['range'][index])
      //     }
      //   }
      //   // for (const key in val) {
      //   //   if (Array.isArray(val[key])) {
      //   //     // if (!this.components_data['periodical?register=periodical&transformation=limit%3A30000'][key]) this.$set(this.components_data['periodical?register=periodical&transformation=limit%3A30000'], key, null)
      //   //     for (const i in val[key]) {
      //   //       if (!this.components_data['periodical?register=periodical&transformation=limit%3A30000'][key]) this.$set(this.components_data['periodical?register=periodical&transformation=limit%3A30000'], key, [])
      //   //       this.$set(this.components_data['periodical?register=periodical&transformation=limit%3A30000'][key], i, val[key][i])
      //   //     }
      //   //   } else {
      //   //     this.$set(this.components_data['periodical?register=periodical&transformation=limit%3A30000'], key, val[key])
      //   //   }
      //   // }
      //   // this.$set(this.components_data, 'periodical?register=periodical&transformation=limit%3A30000', val)
      //   // this.$set(this.MyRange, 0, val.range[0])
      //   // this.$set(this.MyRange, 1, val.range[1])
      // })
    },
    __unregister_store_module: function (id) {
      debug('__unregister_store_module', id)

      if (!process.env.DEV) {
        if (id && this.$store.state[id + '_sources']) {
          this.$store.unregisterModule(id + '_sources')
        }
      }
    },

    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
    },
    __process_data: function (payload) {
      debug('__process_data', payload)
      // for (const key in payload.data) {
      //   this.$store.commit(this.id + '_sources/append', { id: payload.id, key: key, data: payload.data[key] })
      // }
      if (this.store) {
        this.$store.commit(this.id + '_sources/add', payload)
      } else {
        let key = payload.id

        for (const prop in this.components) {
          let components = this.components[prop]
          // if (!Array.isArray(components)) components = [components]

          if (Array.isArray(components)) {
            for (let index = 0; index < components.length; index++) {
              if (
                components[index].source &&
                this.__source_to_keys(components[index].source).contains(key)
              ) {
                this.__update_component_data(components[index], key, payload.data)
              }
            }
          } else {
            if (components.source && this.__source_to_keys(components.source).contains(key)) {
              this.__update_component_data(components, key, payload.data)
            }
          }
        }
      }
    },
    __components_sources_to_requests: function (_components) {
      let requests = {}
      let sources = {}

      // let _components = JSON.parse(JSON.stringify(this.components))
      // debug('__components_sources_to_requests', _components)
      for (const key in _components) {
        let components = _components[key]

        if (!Array.isArray(components)) {
          components = [components]
        }

        for (const index in components) {
          if (components[index].source && components[index].source.requests) {
            let _requests = components[index].source.requests

            for (const req_type in _requests) {
              let reqs = _requests[req_type]
              if (!Array.isArray(reqs)) { reqs = [reqs] }

              for (let j = 0; j < reqs.length; j++) {
                let key_source = reqs[j].params
                let source = reqs[j].params

                debug('__components_sources_to_requests', j, reqs, typeof (source))

                if (typeof source === 'string') {
                  source = { path: source.substring(0, source.indexOf('?')), query: qs.parse(source.substring(source.indexOf('?') + 1)) }
                } else {
                  key_source = key_source.path + '?' + qs.stringify(Object.merge(key_source.params, key_source.body))
                }

                if (!sources[req_type]) sources[req_type] = {}

                sources[req_type][key_source] = source
              }
            }
          }
        }
      }

      // debug('__components_sources_to_requests', sources)
      for (const req_type in sources) {
        for (const key in sources[req_type]) {
          if (!requests[req_type]) requests[req_type] = []

          requests[req_type].push({
            init: function (req, next, app) {
              debug('INIT', app)
              app.io.emit('/', { query: sources[req_type][key].query })
            }
          })
        }
      }

      debug('__components_sources_to_requests', requests)
      return requests
      // template.input[0].poll.conn[0].requests.once.push({
      //   init: function (req, next, app) {
      //     debug('INIT', app)
      //     app.io.emit('/', {
      //       query: { register: 'periodical' },
      //       body: {
      //         'transformation': 'limit:30000'
      //
      //       }
      //     })
      //   }
      // })
    },

    destroy_pipelines: function () {
      debug('destroy_pipelines')

      Object.each(this.$options.pipelines, function (pipe, id) { // destroy old ones
        pipe.fireEvent('onSuspend')
        pipe.fireEvent('onExit')
        pipe.removeEvents()

        delete this.$options.pipelines[id]
      }.bind(this))

      debug('destroy_pipelines', this.$options.pipelines)
    }
    /**
    * @end pipelines
    **/
  }
}

// import 'admin-lte/dist/js/adminlte.min.js'
</script>

<style>
</style>
