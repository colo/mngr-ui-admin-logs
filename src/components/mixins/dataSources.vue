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

  sources: {
    data: {},
    stat: {},
    tabular: {}
  },

  data () {
    return {
      id: undefined,
      components_data: {
        'periodical?register=periodical&transformation=limit%3A30000': { range: [], hosts: [] }
      },
      store: false,
      // EventBus: EventBus
      MyRange: []
      // components_data: {
      //
      // }
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

    this.create_pipelines()
  },

  mounted: function () {
    debug('mounted')
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
    __update_component_data: function (component, data) {
      if (component.onData && typeof component.onData === 'function') {
        debug('__update_component_data', component)
        component.onData.attempt(data, component)
      }
    },
    __source_to_string: function (query) {
      if (typeof query === 'string') {
        return query
      } else {
        let _query = Object.merge(query.query, query.body)
        debug('__query_to_string', this.id + '?' + qs.stringify(_query))
        return query.path + '?' + qs.stringify(_query)
      }
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
          if (Array.isArray(components)) {
            for (const index in components) {
              if (components[index].source && this.__source_to_string(components[index].source) === key) {
                this.__update_component_data(components[index], payload.data)
              }
            }
          } else {
            if (components.source && this.__source_to_string(components.source) === key) {
              this.__update_component_data(components, payload.data)
            }
          }
        }
      }

      // if(payload.range === true)
      // //console.log('recived doc via Event stats', payload)

      // let type = (payload.tabular === true) ? 'tabular' : 'stat'
      // let { type } = payload
      //
      // let init = (type === 'tabular') ? 'tabular_init' : 'stat_init'
      // // let iterate = (type === 'tabulars') ? payload.stats : payload.stats.data
      // let whitelist = (type === 'tabular') ? this.$options.tabular_whitelist : this.$options.stat_whitelist
      // let blacklist = (type === 'tabular') ? this.$options.tabular_blacklist : this.$options.stat_blacklist

      // let counter = 0
      // if (payload[type]) {
      //   if (Object.getLength(payload[type]) > 0) {
      //     Object.each(payload[type], function (data, path) {
      //       let new_path
      //       let new_val
      //       if (Array.isArray(data)) {
      //         // if((whitelist && whitelist.test(path)) || (blacklist && !blacklist.test(path)))
      //         // if (process.env.DEV) debug('__process_dashboard_data', payload.key + '_' + path)
      //
      //         if (this.__white_black_lists_filter(whitelist, blacklist, path)) {
      //           this.$store.commit('dashboard_' + this.id + '/' + type + '_sources/add', { key: payload.key + '_' + path, value: data })
      //         }
      //       } else {
      //         Object.each(data, function (value, key) {
      //           if (Array.isArray(value)) {
      //             // if((whitelist && whitelist.test(path+'.'+key)) || (blacklist && !blacklist.test(path+'.'+key)))
      //             // if (process.env.DEV) debug('__process_dashboard_data', payload.key + '_' + path + '_' + key)
      //
      //             if (this.__white_black_lists_filter(whitelist, blacklist, path + '_' + key)) {
      //               this.$store.commit('dashboard_' + this.id + '/' + type + '_sources/add', { key: payload.key + '_' + path + '_' + key, value: value })
      //             }
      //           } else {
      //             // 3rd level, there is no need for more
      //             Object.each(value, function (val, sub_key) {
      //               // if (process.env.DEV) debug('__process_dashboard_data', payload.key + '_' + path + '_' + key + '_' + sub_key)
      //
      //               if (this.__white_black_lists_filter(whitelist, blacklist, path + '_' + key + '_' + sub_key)) {
      //                 this.$store.commit('dashboard_' + this.id + '/' + type + '_sources/add', { key: payload.key + '_' + path + '_' + key + '_' + sub_key, value: val })
      //               }
      //             }.bind(this))
      //           }
      //         }.bind(this))
      //       }
      //
      //       if (counter === Object.getLength(payload[type]) - 1) {
      //         this.$set(this, init, true)
      //         // this[init] = true
      //         this.$emit(type + '_sources')
      //       }
      //
      //       counter++
      //     }.bind(this))
      //   }
      //   // else{
      //   //   this.$set(this, init, true)
      //   // }
      // }
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
    create_pipelines: function () {},
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
