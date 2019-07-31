<script>

import * as Debug from 'debug'
const debug = Debug('components:mixins:DataSources')

import sourceStore from 'src/store/source'

export default {
  name: 'data-sources',

  components: {

  },

  data () {
    return {
      id: undefined
      // EventBus: EventBus
    }
  },

  mounted: function () {
    debug('mounted')
    this.__register_store_module(this.id, sourceStore)
  },
  updated: function () {
  },
  methods: {
    __register_store_module: function (id, module) {
      debug('__register_store_module', id)

      // if (!process.env.DEV) { if (old && this.$store.state['data_sources_' + old]) { this.$store.unregisterModule('data_sources_' + old) } }
      // if (old && this.$store.state['dashboard_' + old]) { this.$store.unregisterModule('dashboard_' + old) }

      if (id && !this.$store.state['data_sources_' + id]) { this.$store.registerModule('data_sources_' + id, Object.clone(module)) }
    },
    __unregister_store_module: function (id) {
      debug('__unregister_store_module', id)

      if (!process.env.DEV) {
        if (id && this.$store.state['data_sources_' + id]) { this.$store.unregisterModule('data_sources_' + id) }
      }
    }
  }
}

// import 'admin-lte/dist/js/adminlte.min.js'
</script>

<style>
</style>
