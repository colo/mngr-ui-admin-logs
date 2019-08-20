
<script>
import Vue from 'vue'

import * as Debug from 'debug'
const debug = Debug('pages:root')

import AdminLteMixin from '@components/mixins/adminlte'
import GridViewMixin from '@components/mixins/gridView'
import DataSourcesMixin from '@components/mixins/dataSources'

// import Test from '@components/test/test.vue'

import Pipeline from 'js-pipeline'
import RootPipeline from './pipelines/root'

// import { dom } from 'quasar'
// const { height, width } = dom
let moment = require('moment')

export default {
  mixins: [AdminLteMixin, GridViewMixin, DataSourcesMixin],

  name: 'root',
  // components: { GridView },

  // pipelines: {},
  grid_template: {

    layouts: {
      'lg': [
        { x: 0, y: 0, w: 12, h: 3, i: 'rethinkdb_table' },
        { x: 0, y: 1, w: 3, h: 7, i: 'count' },
        { x: 3, y: 1, w: 3, h: 7, i: 'range' },
        { x: 6, y: 1, w: 3, h: 7, i: 'tags' },
        { x: 9, y: 1, w: 3, h: 7, i: 'hosts' },
        // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
        // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
        // second row
        // { x: 1, y: 1, w: 10, h: 2, i: '6' },
        { x: 0, y: 2, w: 12, h: 16, i: 'chart' }
        // { x: 0, y: 3, w: 12, h: 30, i: '8' }
        // { x: 0, y: 4, w: 12, h: 2, i: '9' }
      ],
      'md': [
        { x: 0, y: 0, w: 8, h: 3, i: 'rethinkdb_table' },
        { x: 0, y: 1, w: 2, h: 7, i: 'count' },
        { x: 2, y: 1, w: 2, h: 7, i: 'range' },
        { x: 4, y: 1, w: 2, h: 7, i: 'tags' },
        { x: 6, y: 1, w: 2, h: 7, i: 'hosts' },
        // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
        // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
        // second row
        // { x: 1, y: 1, w: 6, h: 2, i: '6' },
        { x: 0, y: 2, w: 8, h: 16, i: 'chart' }
        // { x: 0, y: 3, w: 8, h: 20, i: '8' }
        // { x: 0, y: 4, w: 8, h: 2, i: '9' }

      ],
      'sm': [
        { x: 0, y: 0, w: 6, h: 3, i: 'rethinkdb_table' },
        { x: 0, y: 1, w: 3, h: 7, i: 'count' },
        { x: 3, y: 1, w: 3, h: 7, i: 'range' },
        { x: 0, y: 2, w: 3, h: 7, i: 'tags' },
        { x: 3, y: 2, w: 3, h: 7, i: 'hosts' },
        // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
        // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
        // second row
        // { x: 1, y: 2, w: 4, h: 2, i: '6' },
        { x: 0, y: 3, w: 6, h: 16, i: 'chart' }
        // { x: 0, y: 4, w: 6, h: 20, i: '8' }
        // { x: 0, y: 5, w: 6, h: 2, i: '9' }
      ]

    }

  },

  components_template: {
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
            params: {
              path: 'all',
              query: {
                from: undefined,
                register: 'periodical',
                'transformation': [
                  { 'orderBy': { 'index': 'r.asc(timestamp)' } },
                  'limit:30000'
                ]
              }

            },
            callback: function (val, metadata, key) {
              debug('Count', val, key)
              let count = 0
              Array.each(val, function (table) {
                Array.each(table, function (data) {
                  debug('Count table data', data.count)
                  count += data.count
                })
              })

              this.props.inner.text = count
            }
          }]
        }
      }

    }],
    'chart': [{
      component: 'MyChart',
      props: {
        id: 'chart',
        data: {
          labels: [],
          datasets: []
        }
      },
      // KEYS: [
      //   // '.count',
      //   '.tags.nginx',
      //   '.tags.apache',
      //   '.tags.web',
      //   '.tags.frontail',
      //   '.tags.stdio'
      // ],
      // prev: {
      //   // counter: 0
      //   range: [0, 0]
      // },
      current: {
        // range: [0, 0],
        keys: {},
        data: {
          labels: [],
          datasets: []
        }
      },
      source: {
        requests: {
          once: [
            {
              params: {
                path: 'all',
                query: {
                  from: undefined,
                  register: 'periodical',
                  'transformation': [
                    { 'orderBy': { 'index': 'r.asc(timestamp)' } },
                    'limit:30000'
                  ]
                }

              },
              callback: function (table, metadata, key, vm) {
                if (table) {
                  let label = moment(metadata.timestamp).format('DD/MM/YYYY, ha mm:ss') + '-' + moment(metadata.timestamp).format('mm:ss')

                  if (!this.current.data.labels.contains(label)) { this.current.data.labels.push(label) }

                  let index_of_value = this.current.data.labels.indexOf(label)

                  debug('MyChart TABLE ', table, key)

                  Array.each(table, function (data) {
                    Array.each(data, function (val) {
                      debug('MyChart cb ', val, metadata, label, index_of_value, table)

                      let name = val.path
                      // if (name.indexOf(table) > -1) { name = name.substring(name.indexOf(table + '.') + 1) }

                      let dataset = { name: name, chartType: 'bar', values: [], _key: val.path }
                      for (let index = 0; index < this.current.data.datasets.length; index++) {
                        if (this.current.data.datasets[index].name === dataset.name) { dataset = this.current.data.datasets[index] }
                      }
                      Array.each(this.current.data.datasets, function (_dataset, index) {
                        if (_dataset.name === dataset.name) { dataset = _dataset }
                      })

                      // dataset.values.push(val)
                      dataset.values[index_of_value] = val.count * 1

                      let found = false
                      Array.each(this.current.data.datasets, function (_dataset, index) {
                        for (let index = 0; index < this.current.data.datasets.length; index++) {
                          let _dataset = this.current.data.datasets[index]
                          if (_dataset.name === dataset.name) {
                          // debug('MyChart cb FOUND', dataset.name, index)
                            found = true

                            // if (JSON.stringify(this.current.data.datasets[index].values) !== JSON.stringify(dataset.values)) {
                            //   debug('MyChart cb values', JSON.stringify(this.current.data.datasets[index].values), JSON.stringify(dataset.values))
                            // Vue.$set(this.current.data.datasets, index, dataset)
                            this.current.data.datasets[index] = dataset
                          // }
                          }
                        }
                      }.bind(this))

                      if (!found) {
                        this.current.data.datasets.push(dataset)
                        debug('MyChart cb NOT FOUND', dataset.name)
                      }
                    }.bind(this))
                  }.bind(this))

                  // if (this.KEYS.length === this.current.data.datasets.length) {
                  // let data = JSON.parse(JSON.stringify(this.current.data))
                  debug('MyChart cb UPDATING2', this.current.data.datasets, this.current.keys)
                  // this.props.data = data

                  // debug('MyChart cb UPDATING', this.KEYS.length, this.current.data.datasets.length)

                  // let datasets = this.current.data.datasets
                  // let match_length = true
                  //
                  // for (let i = 0; i < this.current.data.datasets.length; i++) {
                  //   let dataset = this.current.data.datasets[i]
                  //   if (dataset.values.length !== this.current.keys[dataset._key].count) { match_length = false }
                  // }
                  //
                  // debug('MyChart cb KEYS', this.current.data.datasets, this.current.keys)
                  //
                  // if (match_length) {
                  // this.update(datasets)
                  let data = JSON.parse(JSON.stringify(this.current.data))
                  debug('MyChart cb UPDATING3', data)
                  this.props.data = data
                  // Vue.$set(this.props, 'data', data)
                  // Object.each(data, function (value, key) {
                  //   debug('MyChart cb UPDATING3', value, key)
                  //   Vue.$set(this.props.data, key, value)
                  // }.bind(this))
                  // }
                  // }

                  // let name = key
                  // if (name.split('.').length > 2) {
                  //   // let prop = _key.split('.')[1]
                  //   name = name.split('.')[2]
                  // }
                }
              }
            }

          ]
          // periodical: [
          //   {
          //     params: function (_key) {
          //       // debug('MyChart ', this.prev, this.current, _key)
          //       debug('MyChart periodical', _key)
          //
          //       const MINUTE = 60000 // 60 secs
          //       // const KEYS = [
          //       //   // '.count',
          //       //   '.tags.nginx',
          //       //   '.tags.apache',
          //       //   '.tags.web',
          //       //   '.tags.frontail',
          //       //   '.tags.stdio'
          //       // ]
          //       // const COUNTS = [
          //       //   this.component + '.count',
          //       //   this.component + '.count.tags.nginx'
          //       // ]
          //
          //       let source
          //       let key
          //
          //       if (!_key) {
          //         key = []
          //         for (let i = 0; i < this.KEYS.length; i++) {
          //           key.push(this.component + this.KEYS[i])
          //         }
          //       }
          //
          //       // debug('MyChart periodical CURRENT', this.prev.range[1], this.current.keys)
          //
          //       if (
          //         _key &&
          //         this.prev.range[1] > 0 &&
          //         (!this.current.keys[_key] || (this.current.keys[_key].range[1] < this.prev.range[1]))
          //       ) { // || !this.current.keys.contains(_key)
          //         debug('MyChart periodical CURRENT', this.current.keys[_key])
          //
          //         source = []
          //         if (!this.current.keys[_key]) {
          //           this.current.keys[_key] = {
          //             range: Array.clone(this.prev.range),
          //             count: 0
          //           }
          //           // this.current.keys[_key].range = Array.clone(this.prev.range)
          //         }
          //
          //         // if (!this.current.keys.contains(_key)) {
          //         do {
          //           let source_tmp = {
          //
          //             params: { id: _key },
          //             query: { 'aggregation': 'count' },
          //             range: 'posix ' + this.current.keys[_key].range[0] + '-' + (this.current.keys[_key].range[0] + MINUTE) + '/*'
          //             // query: {
          //             //   // register: 'periodical',
          //             //   'transformation': [
          //             //     { 'orderBy': { 'index': 'r.asc(timestamp)' } },
          //             //     'limit:30000'
          //             //   ]
          //             // }
          //           }
          //
          //           if (_key.split('.').length > 2) {
          //             let prop = _key.split('.')[1]
          //             let value = _key.split('.')[2]
          //             source_tmp.params.prop = prop
          //             source_tmp.params.value = value
          //           }
          //
          //           source.push(source_tmp)
          //           this.current.keys[_key].range[0] += MINUTE
          //           this.current.keys[_key].count++
          //           // this.current.keys[_key].range[1] = JSON.parse(JSON.stringify(this.current.keys[_key])).range[1] + (MINUTE * 5)
          //         }
          //         while (this.current.keys[_key].range[0] < this.prev.range[1])
          //
          //         // this.current.keys.push(_key)
          //         // }
          //       }
          //
          //       debug('MyChart periodical KEY ', key, source)
          //
          //       return { key, source }
          //     },
          //     callback: function (val, metadata, key) {
          //       // this.prev.keys.push(key)
          //
          //       let label = moment(metadata.range.start).format('DD/MM/YYYY, ha mm:ss') + '-' + moment(metadata.range.end).format('mm:ss')
          //
          //       if (!this.current.data.labels.contains(label)) { this.current.data.labels.push(label) }
          //
          //       let index_of_value = this.current.data.labels.indexOf(label)
          //       debug('MyChart cb ', key, val, metadata, label, index_of_value)
          //
          //       let name = key
          //       if (name.split('.').length > 2) {
          //         // let prop = _key.split('.')[1]
          //         name = name.split('.')[2]
          //       }
          //
          //       let dataset = { name: name, chartType: 'bar', values: [], _key: key }
          //       for (let index = 0; index < this.current.data.datasets.length; index++) {
          //         if (this.current.data.datasets[index].name === dataset.name) { dataset = this.current.data.datasets[index] }
          //       }
          //       // Array.each(this.current.data.datasets, function (_dataset, index) {
          //       //   if (_dataset.name === dataset.name) { dataset = _dataset }
          //       // })
          //
          //       // dataset.values.push(val)
          //       dataset.values[index_of_value] = val * 1
          //
          //       let found = false
          //       // Array.each(this.current.data.datasets, function (_dataset, index) {
          //       for (let index = 0; index < this.current.data.datasets.length; index++) {
          //         let _dataset = this.current.data.datasets[index]
          //         if (_dataset.name === dataset.name) {
          //           // debug('MyChart cb FOUND', dataset.name, index)
          //           found = true
          //
          //           // if (JSON.stringify(this.current.data.datasets[index].values) !== JSON.stringify(dataset.values)) {
          //           //   debug('MyChart cb values', JSON.stringify(this.current.data.datasets[index].values), JSON.stringify(dataset.values))
          //           // Vue.$set(this.current.data.datasets, index, dataset)
          //           this.current.data.datasets[index] = dataset
          //           // }
          //         }
          //       }
          //       // }.bind(this))
          //
          //       if (!found) {
          //         this.current.data.datasets.push(dataset)
          //         debug('MyChart cb NOT FOUND', dataset.name)
          //       }
          //
          //       if (this.KEYS.length === this.current.data.datasets.length) {
          //         // let data = JSON.parse(JSON.stringify(this.current.data))
          //         debug('MyChart cb UPDATING2', this.current.data.datasets, this.current.keys)
          //         // this.props.data = data
          //
          //         // debug('MyChart cb UPDATING', this.KEYS.length, this.current.data.datasets.length)
          //
          //         let datasets = this.current.data.datasets
          //         let match_length = true
          //
          //         for (let i = 0; i < this.current.data.datasets.length; i++) {
          //           let dataset = this.current.data.datasets[i]
          //           if (dataset.values.length !== this.current.keys[dataset._key].count) { match_length = false }
          //         }
          //
          //         debug('MyChart cb KEYS', this.current.data.datasets, this.current.keys)
          //
          //         if (match_length) {
          //           // this.update(datasets)
          //           let data = JSON.parse(JSON.stringify(this.current.data))
          //           debug('MyChart cb UPDATING2', data)
          //           this.props.data = data
          //           // Vue.$set(this.props, 'data', data)
          //           // Object.each(data, function (value, key) {
          //           //   debug('MyChart cb UPDATING3', value, key)
          //           //   Vue.$set(this.props.data, key, value)
          //           // }.bind(this))
          //         }
          //       }
          //     }
          //   }
          //
          // ]
        }
      }

    }]
  },

  data () {
    return {
      /**
      * dataSources
      **/
      store: false,

      root: {
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
      id: 'all',

      grid: {
        layouts: {
          'lg': [
          ],
          'md': [
          ],
          'sm': [

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
        isDraggable: true,
        isResizable: true,
        preview: false
      },

      components: {}
    }
  },

  watch: {
    components: {
      // immediate: true,
      deep: true,
      handler: function (components) {
        debug('watch components', components)
        // Object.each(this.$options.pipelines, function (pipe, id) {
        //   debug('watch components pipe %s %o', id, pipe)
        //   Array.each(pipe.inputs, function (input, index) {
        //     debug('watch components pipe input %o', input)
        //     let options = Object.clone(input.options)
        //
        //   })
        // })
        // components = JSON.parse(JSON.stringify(components))
        // // for (const index in components) {
        // //   for (const i in components[index]) {
        // //     this.resolveComponent(components[index][i])
        // //   }
        // // }
        // components.id = this.id
        // this.viewComponents = components
        this.destroy_pipelines()
        this.create_pipelines()
      }
    }
  },
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
        'all': [{
          source: {
            requests: {
              once: [{
                params: {
                  path: 'all'
                },
                callback: function (tables, metadata, key, vm) {
                  debug('All', tables, vm.$options.grid_template)
                  let grid = JSON.parse(JSON.stringify(vm.grid))
                  let grid_template = Object.clone(vm.$options.grid_template)

                  let last_component_row = 0
                  Object.each(tables, function (data, rt_tb) {
                    debug('All %s', rt_tb)
                    Object.each(grid_template.layouts, function (layout, layout_name) {
                      debug('All layout_name %s', layout_name)
                      Array.each(layout, function (component, index) {
                        let cloned_component = Object.clone(component)
                        cloned_component.i = cloned_component.i + '.' + rt_tb
                        cloned_component.y = cloned_component.y + last_component_row

                        if (!grid.layouts[layout_name]) grid.layouts[layout_name] = []
                        grid.layouts[layout_name].push(cloned_component)
                      })
                      last_component_row++
                    })
                  })

                  let components = JSON.parse(JSON.stringify(vm.components))
                  let components_template = Object.clone(vm.$options.components_template)
                  Object.each(tables, function (data, rt_tb) {
                    debug('All table %s', rt_tb, components_template)
                    Object.each(components_template, function (component, id) {
                      let cloned_component = Array.clone(component)

                      debug('All component %s %o', id, cloned_component)
                      id += '.' + rt_tb
                      Array.each(cloned_component, function (widget, index) {
                        if (widget.props.id) widget.props.id += '.' + rt_tb

                        widget.source.requests.once[0].params.query.from = rt_tb
                      })

                      components[id] = cloned_component
                    })
                  })

                  vm.grid = grid
                  // vm.components = components
                  for (const key in components) {
                    vm.$set(vm.components, key, components[key])
                  }
                  debug('All %o', grid, components)
                  // this.props.inner.text = val[0][0].count
                }
              }]
            }
          }
        }]
      }
    }

    for (const key in components) {
      this.$set(this.components, key, components[key])
    }

    // if (grid) { this.grid = grid }

    // let interval = setInterval(function () {
    //   debug('setInterval', JSON.parse(JSON.stringify(this.grid['layouts']['lg'])))
    //   this.grid.layouts.lg.push({ x: 5, y: 1, w: 7, h: 4, i: '6' })
    //   debug('setInterval', JSON.parse(JSON.stringify(this.grid['layouts']['lg'])))
    //   clearInterval(interval)
    // }.bind(this), 5000)

    // EventBus.$on('root', this.__process_dashboard_root.bind(this))
    // this.create_pipelines()
  },

  methods: {
    // myStyle: function (offset) {
    //   // const size = `calc(100vh - ${offset}px)`
    //   const size = height(document.getElementById('root')) + 500
    //   return {
    //     minHeight: size,
    //     height: size
    //   }
    // }
    // getRange: function () {
    //   debug('getRange', this.root)
    //   return (this.root && this.root.range) ? this.root.range : []
    // },
    // getGridHeight: function () {
    //   debug('getGridHeight', height(document.getElementById('root')))
    //   return height(document.getElementById('root')) + 700
    // },

    /**
    * @start pipelines
    **/
    create_pipelines: function (next) {
      debug('create_pipelines')

      // if (root && Array.isArray(root)) {
      //   Array.each(root, function (log) {
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

      let template = Object.clone(RootPipeline)

      let pipeline_id = template.input[0].poll.id
      // debug('RootPipeline ', template.input[0].poll.conn[0])

      // template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(JSON.parse(JSON.stringify(this.components)))
      template.input[0].poll.conn[0].requests = this.__components_sources_to_requests(this.components)
      // template.input[0].poll.conn[0].queries = this.__components_sources_to_requests(JSON.parse(JSON.stringify(this.components)))

      // debug('RootPipeline ', template.input[0].poll.conn[0].requests)

      // if (!this.$options.pipelines[pipeline_id]) {
      let pipe = new Pipeline(template)

      this.$options.pipelines[pipeline_id] = pipe

      // debug('RootPipeline ', this.$options.pipelines[pipeline_id].inputs[0])
      // this.$options.pipelines[pipeline_id].inputs[0].addEvent('onConnect', this.$options.pipelines[pipeline_id].fireEvent('onOnce'))

      // this.$options.pipelines[pipeline_id].fireEvent('onResume')
      // } else if (this.$options.pipelines[pipeline_id].inputs[0].options.suspended !== false) {
      //   debug('RootPipeline suspended', this.$options.pipelines[pipeline_id].inputs[0].options.suspended)
      //   this.$options.pipelines[pipeline_id].fireEvent('onResume')
      // }

      if (next) { next() }
    }

    /**
    * @end pipelines
    **/

  },
  mounted: function () {
    debug('mounted')
  }

}
</script>
