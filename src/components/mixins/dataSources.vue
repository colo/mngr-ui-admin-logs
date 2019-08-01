<script>

import * as Debug from 'debug'
const debug = Debug('components:mixins:DataSources')

import dataStore from 'src/store/data'

import { EventBus } from '@libs/eventbus'

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

      store: false
      // EventBus: EventBus
    }
  },

  watch: {
    store: function (val) {
      debug('watch store', val)
      if (val) this.__register_store_module(this.id, dataStore)
    }
  },
  created: function () {
    debug('created')
    EventBus.$on(this.id, this.__process_data.bind(this))

    if (this.store) this.__register_store_module(this.id, dataStore)

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
  methods: {
    __process_data: function (payload) {
      debug('__process_data', payload)

      // if (Array.isArray(payload.logs) && payload.logs.length > 0) {
      //   let _menu = {}
      //   Array.each(payload.logs, function (log) {
      //     _menu[log] = {
      //       label: log, icon: 'desktop_windows', route: { name: 'log', params: { log: log } }
      //     }
      //   })
      //
      //   this.$set(this.panels.charts.menu.logs, 'menu', _menu)
      //
      //   this.$store.commit('logs/clear')
      //   this.$store.commit('logs/set', payload.logs)
      //   this.create_pipelines(payload.logs)
      // }
      // this.logs = payload.logs
      // for (const key in payload.logs) {
      //   this.$set(this.logs, key, payload.logs[key])
      // }
      // debug('__process_dashboard_logs', this.logs)

      this.$set(this.range, 0, payload.data.range[0])
      this.$set(this.range, 1, payload.data.range[1])

      // this.$set(this.counter.inner, 'text', payload.logs.count)
      for (const key in payload.data) {
        if (this.components[key]) { this.$set(this.components[key][0].options.inner, 'text', payload.data[key]) }
      }

      // this.$set(this.components[6][0].options.range, 0, payload.logs.range[0])
      // this.$refs['MyRange'].range = payload.logs.range
      // debug('__process_dashboard_logs', this.$refs['MyRange'])
    },
    // __process_dashboard_data: function (payload) {
    //   debug('__process_dashboard_data', payload)
    //   // if(payload.range === true)
    //   // //console.log('recived doc via Event stats', payload)
    //
    //   // let type = (payload.tabular === true) ? 'tabular' : 'stat'
    //   let { type } = payload
    //
    //   let init = (type === 'tabular') ? 'tabular_init' : 'stat_init'
    //   // let iterate = (type === 'tabulars') ? payload.stats : payload.stats.data
    //   let whitelist = (type === 'tabular') ? this.$options.tabular_whitelist : this.$options.stat_whitelist
    //   let blacklist = (type === 'tabular') ? this.$options.tabular_blacklist : this.$options.stat_blacklist
    //
    //   let counter = 0
    //   if (payload[type]) {
    //     if (Object.getLength(payload[type]) > 0) {
    //       Object.each(payload[type], function (data, path) {
    //         let new_path
    //         let new_val
    //         if (Array.isArray(data)) {
    //           // if((whitelist && whitelist.test(path)) || (blacklist && !blacklist.test(path)))
    //           // if (process.env.DEV) debug('__process_dashboard_data', payload.key + '_' + path)
    //
    //           if (this.__white_black_lists_filter(whitelist, blacklist, path)) {
    //             this.$store.commit('dashboard_' + this.id + '/' + type + '_sources/add', { key: payload.key + '_' + path, value: data })
    //           }
    //         } else {
    //           Object.each(data, function (value, key) {
    //             if (Array.isArray(value)) {
    //               // if((whitelist && whitelist.test(path+'.'+key)) || (blacklist && !blacklist.test(path+'.'+key)))
    //               // if (process.env.DEV) debug('__process_dashboard_data', payload.key + '_' + path + '_' + key)
    //
    //               if (this.__white_black_lists_filter(whitelist, blacklist, path + '_' + key)) {
    //                 this.$store.commit('dashboard_' + this.id + '/' + type + '_sources/add', { key: payload.key + '_' + path + '_' + key, value: value })
    //               }
    //             } else {
    //               // 3rd level, there is no need for more
    //               Object.each(value, function (val, sub_key) {
    //                 // if (process.env.DEV) debug('__process_dashboard_data', payload.key + '_' + path + '_' + key + '_' + sub_key)
    //
    //                 if (this.__white_black_lists_filter(whitelist, blacklist, path + '_' + key + '_' + sub_key)) {
    //                   this.$store.commit('dashboard_' + this.id + '/' + type + '_sources/add', { key: payload.key + '_' + path + '_' + key + '_' + sub_key, value: val })
    //                 }
    //               }.bind(this))
    //             }
    //           }.bind(this))
    //         }
    //
    //         if (counter === Object.getLength(payload[type]) - 1) {
    //           this.$set(this, init, true)
    //           // this[init] = true
    //           this.$emit(type + '_sources')
    //         }
    //
    //         counter++
    //       }.bind(this))
    //     }
    //     // else{
    //     //   this.$set(this, init, true)
    //     // }
    //   }
    // },
    __register_store_module: function (id, module) {
      debug('__register_store_module', id)

      // if (!process.env.DEV) { if (old && this.$store.state['data_sources_' + old]) { this.$store.unregisterModule('data_sources_' + old) } }
      // if (old && this.$store.state['dashboard_' + old]) { this.$store.unregisterModule('dashboard_' + old) }

      if (id && !this.$store.state[id + '_sources']) { this.$store.registerModule(id + '_sources', Object.clone(module)) }
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
