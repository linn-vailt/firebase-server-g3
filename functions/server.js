const express = require('express')
const app = express()
app.use(express.json())

const port = process.env.PORT || 3000;



app.get('/', (req, res) => {
    res.json({status: "ok"})
})

module.exports = app
