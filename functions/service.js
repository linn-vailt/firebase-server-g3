require ('dotenv').config()
const app = require('./server.js')

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('http server is listening to you bich! on port ${PORT}')
})