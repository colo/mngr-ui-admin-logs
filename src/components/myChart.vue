<template>
  <div
    :ref="id"
    :id="id"
  />

</template>
<script>

import * as Debug from 'debug'
const debug = Debug('components:MyChart')

import { Chart } from 'frappe-charts/dist/frappe-charts.min.esm'

import { dom } from 'quasar'
const { ready } = dom

export default {
  name: 'MyChart',

  chart: undefined,
  props: {
    data: {
      type: [Object],
      default: function () {
        return {
          labels: [],

          datasets: [
            // {
            //   name: 'Some Data',
            //   chartType: 'bar',
            //   values: [25, 40, 30, 35, 8, 52, 17, -4]
            // },
          ]

          // yMarkers: [{ label: 'Marker',
          //   value: 70,
          //   options: { labelPos: 'left' } }],
          // yRegions: [{ label: 'Region',
          //   start: -10,
          //   end: 50,
          //   options: { labelPos: 'right' } }]
        }
      }
    }
  },
  // components: { WrappersFrappeCharts },
  mounted: function () {
    ready(this.create_chart())
  },
  watch: {
    'data': {
      handler: function (val) {
        debug('watch', val, this)
        // this.update(val)

        this.create_chart()

        // if (!this.$options.chart) { this.create_chart() }
        //
        // if (this.$options.chart) { this.$options.chart.update(val) }
      },
      deep: true
    }
  },
  data () {
    return {
      id: 'myChart',
      chart: undefined,
      options: {
        // data: {
        //   labels: ['12am-3am', '3am-6am', '6am-9am', '9am-12pm',
        //     '12pm-3pm', '3pm-6pm', '6pm-9pm', '9pm-12am'],
        //
        //   datasets: [
        //     {
        //       name: 'Some Data',
        //       chartType: 'bar',
        //       values: [25, 40, 30, 35, 8, 52, 17, -4]
        //     },
        //     {
        //       name: 'Another Set',
        //       chartType: 'bar',
        //       values: [25, 50, -10, 15, 18, 32, 27, 14]
        //     },
        //     {
        //       name: 'Yet Another',
        //       chartType: 'bar',
        //       values: [15, 20, -3, -15, 58, 12, -17, 37]
        //     }
        //   ],
        //
        //   yMarkers: [{ label: 'Marker',
        //     value: 70,
        //     options: { labelPos: 'left' } }],
        //   yRegions: [{ label: 'Region',
        //     start: -10,
        //     end: 50,
        //     options: { labelPos: 'right' } }]
        // },

        // title: 'My Awesome Chart',
        // type: 'axis-mixed', // or 'bar', 'line', 'pie', 'percentage'
        type: 'bar', // or 'bar', 'line', 'pie', 'percentage'
        height: 300,
        colors: ['purple', '#ffa3ef', 'light-blue'],

        tooltipOptions: {
          formatTooltipX: d => (d + '').toUpperCase(),
          formatTooltipY: d => d + ' pts'
        }
      }
    }
  },
  methods: {
    create_chart: function () {
      if (this.data && this.data.labels.length > 0 && this.data.datasets.length > 0) {
        this.$options.chart = new Chart(
          document.getElementById(this.id), // containing div
          Object.merge(Object.clone(this.options), { data: Object.clone(this.data) })
        )
      }
    }
    // update: function (data) {
    //   if (this.$options.chart) { this.$options.chart.update(data) }
    // }
  }
}

</script>
