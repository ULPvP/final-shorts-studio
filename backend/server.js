import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

const __dirname = path.resolve()
console.log(__dirname + `/static`)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  // app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '/client/build/index.html'))
  )
}

else {

  app.use(express.static(__dirname + `/app/client/build/static`))
  app.use(express.static(__dirname + `/app/backend/images`))
  app.use(express.static(__dirname + '/app/client/build/manifest.json'))
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname + '/app/client/build/images/studio.jpg'))
  })
  app.use
    (path.join(__dirname + '/app', '/client', '/build', '/index.html'))

}
 
// app.get('/', (req, res) => {

//   res.sendFile(path.resolve(__dirname+'/client/build/index.html'))
//   console.log(__dirname+'/client/build/index.html')
// })




app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5005

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
process.on('uncaughtException', function (err) {
  console.log(err);
});
