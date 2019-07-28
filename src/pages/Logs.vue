<template>
  <!-- <q-page class="flex flex-center"> -->
  <q-page>
    <!-- <img alt="Quasar logo" src="~assets/quasar-logo-full.svg"> -->
    <grid-view :id="id" :components="components" :grid="grid" />
  </q-page>
</template>

<style>
</style>

<script>
import * as Debug from 'debug'
const debug = Debug('pages:Logs')

import admin_lte_mixin from '@components/mixins/adminlte'

import GridView from '@components/gridView'

// import Test from '@components/test/test.vue'

export default {
  mixins: [admin_lte_mixin],

  name: 'Logs',
  components: { GridView },

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

    if (components) { this.components = components }

    if (grid) { this.grid = grid }

    // let interval = setInterval(function () {
    //   debug('setInterval', JSON.parse(JSON.stringify(this.grid['layouts']['lg'])))
    //   this.grid.layouts.lg.push({ x: 5, y: 1, w: 7, h: 4, i: '6' })
    //   debug('setInterval', JSON.parse(JSON.stringify(this.grid['layouts']['lg'])))
    //   clearInterval(interval)
    // }.bind(this), 5000)
  },

  data () {
    return {
      id: 'logs',
      grid: {
        layouts: {
          'lg': [
            { x: 0, y: 0, w: 3, h: 7, i: '0' },
            { x: 3, y: 0, w: 3, h: 7, i: '1' },
            { x: 6, y: 0, w: 3, h: 7, i: '2' },
            { x: 9, y: 0, w: 3, h: 7, i: '3' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
            // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
            // second row
            { x: 1, y: 1, w: 10, h: 2, i: '6' },
            { x: 0, y: 2, w: 12, h: 16, i: '7' },
            { x: 0, y: 3, w: 12, h: 20, i: '8' }
          ],
          'md': [
            { x: 0, y: 0, w: 2, h: 7, i: '0' },
            { x: 2, y: 0, w: 2, h: 7, i: '1' },
            { x: 4, y: 0, w: 2, h: 7, i: '2' },
            { x: 6, y: 0, w: 2, h: 7, i: '3' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
            // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
            // second row
            { x: 1, y: 1, w: 6, h: 2, i: '6' },
            { x: 0, y: 2, w: 8, h: 16, i: '7' },
            { x: 0, y: 3, w: 8, h: 20, i: '8' }

          ],
          'sm': [
            { x: 0, y: 0, w: 3, h: 7, i: '0' },
            { x: 3, y: 0, w: 3, h: 7, i: '1' },
            { x: 0, y: 1, w: 3, h: 7, i: '2' },
            { x: 3, y: 1, w: 3, h: 7, i: '3' },
            // { x: 8, y: 0, w: 2, h: 7, i: '4', immobile: true },
            // { x: 10, y: 0, w: 2, h: 7, i: '5', immobile: true },
            // second row
            { x: 1, y: 2, w: 4, h: 2, i: '6' },
            { x: 0, y: 3, w: 6, h: 16, i: '7' },
            { x: 0, y: 4, w: 6, h: 20, i: '8' }

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
      components: {
        '0': [{
          component: 'admin-lte-small-box',
          options: {
            bg: 'bg-positive',
            inner: {
              header: 'Count',
              text: '#'
            },
            icon: 'fa fa-chart-bar'
          }
        }],
        '1': [{
          component: 'admin-lte-small-box',
          options: {
            bg: 'bg-info',
            inner: {
              header: 'Range',
              text: '26/07/2019 - 27/07/2019'
            },
            icon: 'fa fa-calendar'
          }
        }],
        '2': [{
          component: 'admin-lte-small-box',
          options: {
            bg: 'bg-info',
            inner: {
              header: 'Tags',
              text: 'nginx - web - apache - stdin'
            },
            icon: 'fa fa-tags'
          }
        }],
        '3': [{
          component: 'admin-lte-small-box',
          options: {
            bg: 'bg-info',
            inner: {
              header: 'Hosts',
              text: 'colo'
            },
            icon: 'fa fa-server'
          }
        }],
        '6': [{
          component: 'MyRange'
        }],
        '7': [{
          component: 'MyChart'
        }],

        '8': [{
          component: 'MyTable'
          // options: {
          //   title: 'Logs',
          //   data: [
          //     {
          //       name: 'Frozen Yogurt',
          //       calories: 159,
          //       fat: 6.0,
          //       carbs: 24,
          //       protein: 4.0,
          //       sodium: 87,
          //       calcium: '14%',
          //       iron: '1%'
          //     }
          //   ],
          //   columns: [
          //     {
          //       name: 'name',
          //       required: true,
          //       label: 'Dessert (100g serving)',
          //       align: 'left'
          //       // field: row => row.name,
          //       // format: val => `${val}`,
          //       // sortable: true
          //     },
          //     { name: 'calories', align: 'center', label: 'Calories', field: 'calories', sortable: true },
          //     { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
          //     { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
          //     { name: 'protein', label: 'Protein (g)', field: 'protein' },
          //     { name: 'sodium', label: 'Sodium (mg)', field: 'sodium' },
          //     { name: 'calcium', label: 'Calcium (%)', field: 'calcium', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
          //     { name: 'iron', label: 'Iron (%)', field: 'iron', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) }
          //   ],
          //   'row-key': 'name'
          // }
        }],
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
        //   options: {
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
        //     // options: {
        //     //   bg: 'bg-primary'
        //     // },
        //     defaultSize: 2
        //   }
        // ],
        '4': [],
        '5': [
          {
            component: 'q-btn',
            // defaultSize: 2,
            options: {
              // round: true,
              label: 'edit/preview',
              style: 'position: relative'
              // '@click': "$emit('disableGrid')"
            },
            events: {
              click: 'disableGrid'
            }
            // componentProps: "round color: 'primary'"
          },
          {
            component: 'q-btn',
            // defaultSize: 2,
            options: {
            // round: true,
              label: 'draggables',
              style: 'position: relative'
            // '@click': "$emit('disableGrid')"
            },
            events: {
              click: 'disableEdit'
            }
          // componentProps: "round color: 'primary'"
          }]
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
  }
}
</script>
