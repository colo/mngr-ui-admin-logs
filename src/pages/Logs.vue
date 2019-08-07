
<script>
import * as Debug from 'debug'
const debug = Debug('pages:Logs')

import AdminLteMixin from '@components/mixins/adminlte'
import GridViewMixin from '@components/mixins/gridView'
import DataSourcesMixin from '@components/mixins/dataSources'

// import Test from '@components/test/test.vue'

import Pipeline from 'js-pipeline'
import LogsPipeline from '@libs/pipelines/logs'

// import { dom } from 'quasar'
// const { height, width } = dom
let moment = require('moment')

export default {
  mixins: [AdminLteMixin, GridViewMixin, DataSourcesMixin],

  name: 'Logs',
  // components: { GridView },

  // pipelines: {},

  data () {
    return {
      /**
      * dataSources
      **/
      store: false,

      logs: {
        count: undefined
      },
      range: [0, 1],
      // counter: {
      //   inner: {
      //     header: 'Count',
      //     text: ''
      //   }
      // },

      // height: '0px',
      id: 'logs',
      grid: {
        layouts: {
          'lg': [
            { x: 0, y: 0, w: 3, h: 7, i: 'count' },
            { x: 3, y: 0, w: 3, h: 7, i: 'range' },
            { x: 6, y: 0, w: 3, h: 7, i: 'tags' },
            { x: 9, y: 0, w: 3, h: 7, i: 'hosts' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
            // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
            // second row
            { x: 1, y: 1, w: 10, h: 2, i: '6' },
            { x: 0, y: 2, w: 12, h: 16, i: '7' },
            { x: 0, y: 3, w: 12, h: 30, i: '8' }
            // { x: 0, y: 4, w: 12, h: 2, i: '9' }
          ],
          'md': [
            { x: 0, y: 0, w: 2, h: 7, i: 'count' },
            { x: 2, y: 0, w: 2, h: 7, i: 'range' },
            { x: 4, y: 0, w: 2, h: 7, i: 'tags' },
            { x: 6, y: 0, w: 2, h: 7, i: 'hosts' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
            // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
            // second row
            { x: 1, y: 1, w: 6, h: 2, i: '6' },
            { x: 0, y: 2, w: 8, h: 16, i: '7' },
            { x: 0, y: 3, w: 8, h: 20, i: '8' }
            // { x: 0, y: 4, w: 8, h: 2, i: '9' }

          ],
          'sm': [
            { x: 0, y: 0, w: 3, h: 7, i: 'count' },
            { x: 3, y: 0, w: 3, h: 7, i: 'range' },
            { x: 0, y: 1, w: 3, h: 7, i: 'tags' },
            { x: 3, y: 1, w: 3, h: 7, i: 'hosts' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
            // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
            // second row
            { x: 1, y: 2, w: 4, h: 2, i: '6' },
            { x: 0, y: 3, w: 6, h: 16, i: '7' },
            { x: 0, y: 4, w: 6, h: 20, i: '8' }
            // { x: 0, y: 5, w: 6, h: 2, i: '9' }
          ]

        },
        breakpoint: 'lg',
        // slots: [
        //   '<q-btn round />'
        // ],

        cols: 12,
        // breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
        colsAll: { lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 },
        // rowHeight: 400,
        isDraggable: false,
        isResizable: false,
        preview: true
      },
      components: {}
    }
  },

  // watch:{
  //   this.$store.state[this.id + '_sources']['logs?register=periodical&transformation=limit%3A30000']
  // },
  created: function () {
    let components
    try {
      components = JSON.parse(JSON.stringify(this.$store.getters['components/getComponents'](this.id)))
    } catch (e) {}

    let grid
    try {
      grid = JSON.parse(JSON.stringify(this.$store.getters['grids/getGrid'](this.id)))
    } catch (e) {

    }

    debug('created', components)
    if (!components || Object.keys(components).length === 0) {
      components = {
        'count': [{
          component: 'admin-lte-small-box',
          props: {
            bg: 'bg-positive',
            inner: {
              header: 'Count',
              text: ''
              // text: this.logs.count
            }, // this.counter.inner
            icon: 'fa fa-chart-bar'
          },
          source: {
            requests: {
              once: [{
                params: 'logs?register=periodical&transformation=limit%3A30000',
                callback: function (val) {
                  this.props.inner.text = val.count
                }
              }]
            }
          }

        }],
        'range': [{
          component: 'admin-lte-small-box',
          props: {
            bg: 'bg-info',
            inner: {
              header: 'Range',
              // text: '26/07/2019 - 27/07/2019'
              text: ''
            },
            icon: 'fa fa-calendar'
          },
          source: {
            requests: {
              once: [{
                params: 'logs?register=periodical&transformation=limit%3A30000',
                callback: function (val) {
                  this.props.inner.text = val.range
                }
              }]
            }
          }
        }],
        'tags': [{
          component: 'admin-lte-small-box',
          props: {
            bg: 'bg-info',
            inner: {
              header: 'Tags',
              // text: 'nginx - web - apache - stdin'
              text: ''
            },
            icon: 'fa fa-tags'
          },
          source: {
            requests: {
              once: [{
                params: 'logs?register=periodical&transformation=limit%3A30000',
                callback: function (val) {
                  this.props.inner.text = val.tags
                }
              }]
            }
          }
        }],
        'hosts': [{
          component: 'admin-lte-small-box',
          props: {
            bg: 'bg-info',
            inner: {
              header: 'Hosts',
              // text: 'colo'
              text: ''
            },
            icon: 'fa fa-server'
          },
          source: {
            requests: {
              once: [{
                params: 'logs?register=periodical&transformation=limit%3A30000',
                callback: function (val) {
                  this.props.inner.text = val.hosts
                }
              }]
            }
          }
        }],
        '6': [{
          component: 'MyRange',
          props: {
            // range: this.$store.state[this.id + '_sources']['logs?register=periodical&transformation=limit%3A30000']['range']
            range: []
            // range: this.MyRange
            // ref: 'MyRange'
          },
          // source: {
          //   path: 'logs',
          //   params: { register: 'periodical', 'transformation': 'limit:30000' }
          //   // body: {
          //   //   'transformation': 'limit:30000'
          //   //
          //   // }
          // },
          // onData: function (val) {
          //   this.props.range = val.range
          // }
          source: {
            requests: {
              once: [{
                params: {
                  path: 'logs',
                  query: { register: 'periodical', 'transformation': 'limit:30000' }
                  // body: {
                  //   'transformation': 'limit:30000'
                  //
                  // }
                },
                callback: function (val) {
                  this.props.range = val.range
                }
              }]
            }
          }
        }],
        '7': [{
          component: 'MyChart'
        }],

        '8': [{
          component: 'MyTable',
          props: {
            data: []
          },
          source: {
            requests: {
              once: [{
                params: {
                  path: 'logs',
                  query: {
                    'q': [
                      { 'data': ['log'] },
                      { 'metadata': ['host', 'tag', 'timestamp'] }
                    ],
                    'transformation': 'slice:0:9'
                  }
                  // body: {
                  //   'transformation': 'limit:30000'
                  //
                  // }
                },
                callback: function (val) {
                  debug('MyTable', val)
                  if (!Array.isArray(val)) val = [val]

                  val.sort(function (a, b) {
                    if (a.metadata.timestamp > b.metadata.timestamp) {
                      return -1
                    }
                    if (a.metadata.timestamp < b.metadata.timestamp) {
                      return 1
                    }
                    // a must be equal to b
                    return 0
                  })

                  for (let i = 0; i < val.length; i++) {
                    let row = Object.merge(val[i].data, val[i].metadata)
                    row.date = moment(row.timestamp).fromNow()

                    debug('MyTable', row)
                    this.props.data.push(row)
                  }
                }
              }]
            }
          }
        }]
        // '9': [{
        //   component: 'MyRange'
        // }]
        // '9': [{
        //   component: 'q-btn'
        // }],
        // '1': [{
        //   id: 1,
        //   component: 'admin-lte-events'
        // }],
        // '2': [{
        //   id: 2,
        //   component: 'admin-lte-fullcalendar'
        // }]
        // '1': [{
        //   id: 0,
        //   component: 'admin-lte-box',
        //   props: {
        //     type: 'box-success',
        //     title: 'MyBox',
        //     body: {
        //       text: 'box content'
        //     },
        //     footer: false
        //   }
        //   // defaultSize: 2
        // }],
        // '2': [
        //   {
        //     id: 2,
        //     component: 'admin-lte-small-box',
        //     // props: {
        //     //   bg: 'bg-primary'
        //     // },
        //     defaultSize: 2
        //   }
        // ],
        // '4': [],
        // '9': [
        //   {
        //     component: 'q-btn',
        //     // defaultSize: 2,
        //     props: {
        //       // round: true,
        //       label: 'edit/preview'
        //       // style: 'position: relative'
        //       // '@click': "$emit('disableGrid')"
        //     },
        //     events: {
        //       click: 'disableGrid'
        //     }
        //     // componentProps: "round color: 'primary'"
        //   },
        //   {
        //     component: 'q-btn',
        //     // defaultSize: 2,
        //     props: {
        //     // round: true,
        //       label: 'draggables'
        //       // style: 'position: relative'
        //     // '@click': "$emit('disableGrid')"
        //     },
        //     events: {
        //       click: 'disableEdit'
        //     }
        //   // componentProps: "round color: 'primary'"
        //   }]
        // '5': [{
        //   // component: 'admin-lte-box'
        //   component: 'TestTest'
        //   // defaultSize: 2
        // }],
        // '6': [{
        //   // component: 'admin-lte-box'
        //   component: 'SecondSecond'
        //   // defaultSize: 2
        // }]
      }
    }

    for (const key in components) {
      this.$set(this.components, key, components[key])
    }

    if (grid) { this.grid = grid }

    // let interval = setInterval(function () {
    //   debug('setInterval', JSON.parse(JSON.stringify(this.grid['layouts']['lg'])))
    //   this.grid.layouts.lg.push({ x: 5, y: 1, w: 7, h: 4, i: '6' })
    //   debug('setInterval', JSON.parse(JSON.stringify(this.grid['layouts']['lg'])))
    //   clearInterval(interval)
    // }.bind(this), 5000)

    // EventBus.$on('logs', this.__process_dashboard_logs.bind(this))
    // this.create_pipelines()
  },

  methods: {
    // myStyle: function (offset) {
    //   // const size = `calc(100vh - ${offset}px)`
    //   const size = height(document.getElementById('logs')) + 500
    //   return {
    //     minHeight: size,
    //     height: size
    //   }
    // }
    // getRange: function () {
    //   debug('getRange', this.logs)
    //   return (this.logs && this.logs.range) ? this.logs.range : []
    // },
    // getGridHeight: function () {
    //   debug('getGridHeight', height(document.getElementById('logs')))
    //   return height(document.getElementById('logs')) + 700
    // },

    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines')

      // if (logs && Array.isArray(logs)) {
      //   Array.each(logs, function (log) {
      //     if (log) {
      //       let template = Object.clone(LogPipeline)
      //
      //       template.input[0].poll.conn[0].stat_log = log
      //
      //       template.input[0].poll.id += '-' + log
      //       template.input[0].poll.conn[0].id = template.input[0].poll.id
      //       let pipeline_id = template.input[0].poll.id
      //
      //       // template.input[0].poll.conn[0].id = template.input[0].poll.suspended = true
      //
      //       if (!this.$options.pipelines[pipeline_id]) {
      //         let pipe = new Pipeline(template)
      //
      //         this.$options.pipelines[pipeline_id] = pipe
      //       }
      //     }
      //   }.bind(this))
      // }

      let template = Object.clone(LogsPipeline)

      let pipeline_id = template.input[0].poll.id
      debug('LogsPipeline ', template.input[0].poll.conn[0])

      template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(JSON.parse(JSON.stringify(this.components)))

      if (!this.$options.pipelines[pipeline_id]) {
        let pipe = new Pipeline(template)

        this.$options.pipelines[pipeline_id] = pipe
      } else if (this.$options.pipelines[pipeline_id].inputs[0].options.suspended !== false) {
        debug('LogsPipeline suspended', this.$options.pipelines[pipeline_id].inputs[0].options.suspended)
        this.$options.pipelines[pipeline_id].fireEvent('onResume')
      }

      if (next) { next() }
    }

    /**
    * @end pipelines
    **/
    // __process_dashboard_logs: function (payload) {
    //   debug('__process_dashboard_logs', payload)
    //
    //   // if (Array.isArray(payload.logs) && payload.logs.length > 0) {
    //   //   let _menu = {}
    //   //   Array.each(payload.logs, function (log) {
    //   //     _menu[log] = {
    //   //       label: log, icon: 'desktop_windows', route: { name: 'log', params: { log: log } }
    //   //     }
    //   //   })
    //   //
    //   //   this.$set(this.panels.charts.menu.logs, 'menu', _menu)
    //   //
    //   //   this.$store.commit('logs/clear')
    //   //   this.$store.commit('logs/set', payload.logs)
    //   //   this.create_pipelines(payload.logs)
    //   // }
    //   // this.logs = payload.logs
    //   // for (const key in payload.logs) {
    //   //   this.$set(this.logs, key, payload.logs[key])
    //   // }
    //   // debug('__process_dashboard_logs', this.logs)
    //
    //   this.$set(this.range, 0, payload.logs.range[0])
    //   this.$set(this.range, 1, payload.logs.range[1])
    //
    //   // this.$set(this.counter.inner, 'text', payload.logs.count)
    //   for (const key in payload.logs) {
    //     if (this.components[key]) { this.$set(this.components[key][0].options.inner, 'text', payload.logs[key]) }
    //   }
    //
    //   // this.$set(this.components[6][0].options.range, 0, payload.logs.range[0])
    //   // this.$refs['MyRange'].range = payload.logs.range
    //   // debug('__process_dashboard_logs', this.$refs['MyRange'])
    // }
  },
  mounted: function () {
    debug('mounted')
  }
  // updated: function () {
  //   // console.log('height:', height(document.getElementById('logs')))
  //   this.height = this.getGridHeight() + 'px'
  // }
}
</script>
