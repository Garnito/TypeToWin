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
      if (typeof req.session.log === "undefined") {
          req.session.log = 0
      }
      next()
  })

  /* Créer un compte */

  router.post('/register', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    const sql = "SELECT * FROM users WHERE email=$1"
    const result = await client.query({
      text: sql,
      values: [email]
    })
    if (result.rows.length != 0 ) {
      res.status(400).json({ message: 'User with this email already exist' })
      return
    }
    const hash = await bcrypt.hash(password, 10)
    const sql2 = "INSERT INTO users (email, password) VALUES ($1, $2)"
    await client.query({
      text: sql2,
      values: [email, hash]
    })
    res.json(result.rows)
  })

  /* S'identifier sur un compte existant */

  router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
    if (req.session.log > 0) {
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
    req.session.log = user.id
    res.json(user.id)
  })

/* Renvoie l'ID de l'utilisateur identifié */

  router.get('/profile', async (req, res) => {
      res.json(req.session.log)
  })