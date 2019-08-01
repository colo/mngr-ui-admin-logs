'use strict'

// import InputIOApp from '@libs/input/poller/io.app'
import { EventBus } from '@libs/eventbus'

import InputIOLogs from '@libs/pipelines/input/io.logs'

// import DefaultConn from '@etc/default.io'

// const App = require ( 'node-app-socket.io-client/index' )
// let app_io = new App(DefaultConn)

let buffer = {}

import * as Debug from 'debug'
const debug = Debug('libs:pipelines:logs')

export default {
  input: [
    {
      poll: {
        id: 'input.logs',
        conn: [

          Object.merge(
            // Object.clone(DefaultConn),
            {
              id: 'input.logs',
              module: InputIOLogs

            }
          )

        ],
        connect_retry_count: -1,
        connect_retry_periodical: 1000,
        requests: {
          periodical: 1000
        }
      }
    }

  ],
  // filters: [
  //   function (doc, opts, next, pipeline) {
  //     debug('filter', doc, JSON.stringify(doc.opts.query))
  //     let newDoc = {}
  //     newDoc.input = doc.input
  //     newDoc[doc.input] = doc[doc.input]
  //
  //     let key = {}
  //
  //     if (doc.opts.params && Object.keys(doc.opts.params).length > 0) { key.params = doc.opts.params }
  //
  //     if (doc.opts.query && Object.keys(doc.opts.query).length > 0) { key.query = doc.opts.query }
  //
  //     if (Object.keys(key).length > 0) { newDoc.key = JSON.stringify(key) }
  //
  //     debug('filter newDoc', newDoc, key)
  //     next(newDoc, opts, next, pipeline)
  //   }
  // ],
  output: [
    function (payload) {
      debug('OUTPUT', payload)

      if (!payload.err) { EventBus.$emit(payload.metadata.input, payload) }

      // if (!payload.err) { EventBus.$emit('log', payload) }
    }
  ]
}
