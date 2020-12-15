const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { Client } = require('pg')

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'password',
    database: 'TypeToWin'
  })

  client.connect()
  module.exports = router

  router.use((req, res, next) => {
      if (typeof req.session.logId === "undefined") {
          req.session.logId = 0
          req.session.logPseudo = ""
          req.session.friendList = []
      }
      next()
  })

  /* Créer un compte */

  router.post('/register', async (req, res) => {
    const pseudo = req.body.pseudo
    const email = req.body.email
    const password = req.body.password
    const sql = "SELECT * FROM users WHERE pseudo=$1 OR email=$2"
    const result = await client.query({
      text: sql,
      values: [pseudo, email]
    })
    if (result.rows.length != 0 ) {
      res.status(400).json({ message: 'User with this pseudo or email already exist' })
      return
    }
    const hash = await bcrypt.hash(password, 10)
    const sql2 = "INSERT INTO users (pseudo, email, password) VALUES ($1, $2, $3)"
    await client.query({
      text: sql2,
      values: [pseudo, email, hash]
    })
    res.json(result.rows)
  })

  /* S'identifier sur un compte existant */

  router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (req.session.logId != 0) {
      res.status(401).json({ message: 'User already logged' })
      return
    }
    const sql = "SELECT * FROM users WHERE email=$1"
    const result = await client.query({
      text: sql,
      values: [email]
    })
    if (!result.rows.length) {
      res.status(404).json({ message: 'No user with this email exist' })
      return
    }
    const user = result.rows[0]
    if (!await bcrypt.compare(password, user.password)) {
      res.status(400).json({ message: 'Wrong password' })
      return
    }
    req.session.logId = user.id
    req.session.logPseudo = user.pseudo
    res.json({logId: user.id, logPseudo: user.pseudo})
  })

/* Quitter le compte sur lequel on s'est identifié */

  router.put('/profile', async (req, res) => {
    req.session.logId = 0
    req.session.logPseudo = ""
    req.session.friendList = []
    res.json("Delogging successful")
  })

/* Renvoie l'ID, le pseudo et la liste d'ami de l'utilisateur identifié */

  router.get('/profile', async (req, res) => {
    const logId = req.session.logId
    const sql = "SELECT friend_pseudo FROM friends WHERE user_id=$1"
    const result = await client.query({
      text: sql,
      values: [logId]
    })
    var friendList = []
    for (i = 0; i < result.rows.length; i++) {
      friendList.push(result.rows[i].friend_pseudo)
    }
    res.json({logId: req.session.logId, logPseudo: req.session.logPseudo, friendList: friendList})
  })

/* Ajoute un ami à l'aide de son email */

  router.post('/profile', async (req, res) => {
    const logId = req.session.logId
    const friendEmail = req.body.friendEmail
    const sql = "SELECT * FROM users WHERE email=$1"
    const result = await client.query({
      text: sql,
      values: [friendEmail]
    })
    if (!result.rows.length) {
      res.status(404).json({ message: 'No user with this email exist' })
      return
    }
    const friend = result.rows[0]
    if (logId === friend.id) {
      res.status(401).json({ message: "You can't friend yourself ! " })
      return
    }
    const sql2 = "SELECT * FROM friends WHERE user_id=$1 AND friend_id=$2"
    const result2 = await client.query({
      text: sql2,
      values: [logId, friend.id]
    })
    if (result2.rows.length != 0 ) {
      res.status(400).json({ message: 'You are already friend with this user' })
      return
    }
    const sql3 = "INSERT INTO friends (user_id, friend_id, friend_pseudo) VALUES ($1, $2, $3)"
    await client.query({
      text: sql3,
      values: [logId, friend.id, friend.pseudo]
    })
    res.json(friend)
  })