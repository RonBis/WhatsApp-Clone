import express from 'express'
import mongoose from 'mongoose'
import Pusher from 'pusher'
import Cors from 'cors'
import Messages from './dbMessages.js'

//app config
const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
  appId: "1216821",
  key: "13e641de4d5e88910322",
  secret: "5a15a9174b2aa0d6c67b",
  cluster: "ap2",
  useTLS: true
})

const db = mongoose.connection

db.once('open', () => {
  console.log('db connected')

  const msgCollection = db.collection('messagecontents')
  const changeStream = msgCollection.watch()

  changeStream.on('change', (change) => {
    console.log('A change occurred',change)

    if(change.operationType === 'insert'){
      const messageDetails = change.fullDocument
      pusher.trigger('messages', 'inserted',{
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received
      })
    } else {
      console.log('Error triggering pusher')
    }
  })
})

//middleware
app.use(express.json())
app.use(Cors())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

//DB config
const connection_url = 'mongodb+srv://admin:xUE1LZUA9RLIImww@cluster0.syxqj.mongodb.net/whatsappdb?retryWrites=true&w=majority'

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

//????

//api routes
app.get('/', (req, res) => {
  res.status(200).send('hello world')
})

app.get('/messages/sync', (req, res) => {
  Messages.find((err, data) => {
    if(err) {
      res.status(500).send(err)
    } else {
      res.status(200).send(data)
    }
  })
})

app.post('/messages/new', (req, res) => {
  const dbMessage = req.body

  Messages.create(dbMessage, (err, data) => {
    if (err){
      res.status(500).send(err)
    } else {
      res.status(201).send(`new message created: \n ${data}`)
    }
  })
})

//listen
app.listen(port, () => console.log(`Listening on localhost:${port}`))
