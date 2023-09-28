const functions = require('firebase-functions')
const admin = require('firebase-admin')

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const express = require('express')
const app = express()
const db = admin.firestore()

const cors = require('cors')
app.use( cors( {origin:true } ) )


// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

//Routes
app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hello biches!!')
})

//CREATE
app.post('/create', (req, res) => {

    (async () => {
        try{
            await db.collection('blogposts').doc('/' + req.body.id + '/')
            .create({
                title: req.body.title,
                content: req.body.content,
            })
            return res.status(200).send()   
        }
        catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    })()
})


//READ


//UPDATE


//DELETE




exports.api = functions.https.onRequest(app)

