const express = require('express')
const router = express.Router()

const Promise = require('bluebird')
const _ = require('lodash')
const firebase = require('firebase')
const config = require('../config/config.json')

// init firebase
firebase.initializeApp(config)
const db = firebase.database()
// const ref = db.ref('/')
const ref = db.ref('traffic')

/* GET data. */
router.get('/', (req, res, next) => {
  ref
    .once('value')
    .then(snapshot => snapshot.val())
    .then((data) => {
      let sol = []
      _.each(data, (val) => {
        sol.push(val)
      })
      res.json(sol)
    })
})

/*
  GET http://127.0.0.1:3000/traffic/date?startDay="2017-07"
*/

router.get('/date', (req, res, next) => {
  let today = new Date().toISOString().substring(0, 10)
  let startDay = req.query.startDay || '1900-01-01'
  let endDay = req.query.endDay || today

  if (isValidDate(startDay) && isValidDate(endDay)) {
    ref
      .orderByChild('date')
      .startAt(startDay)
      .endAt(endDay)
      .once('value')
      .then(snapshot => snapshot.val())
      .then((data) => {

        let sol = []
        _.each(data, (val) => {
          sol.push(val)
        })
        res.json(sol)
      })
  }else {
    res.json({'msg': 'error date format'})
  }
})

router.get('/type/:type', (req, res, next) => {
  let today = new Date().toISOString().substring(0, 10)
  let startDay = req.query.startDay || '1900-01-01'
  let endDay = req.query.endDay || today

  let type = req.params.type

  if (isValidDate(startDay) && isValidDate(endDay)) {
    ref
      .orderByChild('date')
      .startAt(startDay)
      .endAt(endDay)
      .once('value')
      .then(snapshot => snapshot.val())
      .then((data) => {
        let sol = []
        _.each(data, (val) => {
          if (val.type === type) {
            sol.push(val)
          }
        })
        res.json(sol)
      })
  }else {
    res.json({'msg': 'error date format'})
  }
})

/* POST data */
router.post('/data', (req, res, next) => {
  let date = req.body.date || undefined
  let info = req.body.info || undefined
  let latitude = req.body.latitude || undefined
  let longitude = req.body.longitude || undefined
  let time = req.body.time || undefined
  let type = req.body.type || undefined

  let regExTime = /^\d{2}:\d{2}$/

  if (_.isUndefined(date) && _.isUndefined(info) && _.isUndefined(latitude) && _.isUndefined(longitude) && _.isUndefined(time) && _.isUndefined(type)) {
    res.json({ 'msg': 'data format error' })
  }
  if (!isValidDate(date)) {
    res.json({'msg': 'date format error'})
  }
  if (latitude > 90 || latitude < -90 || !_.isNumber(latitude)) {
    res.json({'msg': 'latitude format error'})
  }
  if (longitude > 180 || longitude < -180 || !_.isNumber(longitude)) {
    res.json({'msg': 'longitude format error'})
  }
  if (time.match(regExTime) === null) {
    res.json({'msg': 'time format error'})
  }

  ref.push().set({
    date: date,
    info: info,
    latitude: latitude,
    longitude: longitude,
    time: time,
    type: type
  })

  res.json({'msg': 'succese'})
})

function isValidDate (dateString) {
  let regEx = /^\d{4}-\d{2}-\d{2}$/
  return dateString.match(regEx) !== null
}

module.exports = router
