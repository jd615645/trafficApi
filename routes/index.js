const express = require('express')
const router = express.Router()
// const firebase = require('firebase')
// const config = require('../config/config.json')

// // init firebase
// firebase.initializeApp(config)
// const db = firebase.database()
// const ref = db.ref('/')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' })
})

module.exports = router
