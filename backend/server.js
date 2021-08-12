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


import couponRoutes from './routes/couponRoutes.js'
dotenv.config()

connectDB()

const app = express()

if ( process.env.NODE_ENV === 'development' ) {
  app.use( morgan( 'dev' ) )
}

app.use( express.json() )

app.use( '/api/products', productRoutes )
app.use( '/api/users', userRoutes )
app.use( '/api/orders', orderRoutes )
app.use( '/api/upload', uploadRoutes )
app.use( '/api/coupons', couponRoutes )
// app.get('/api/config/paypal', (req, res) =>
//   res.send(process.env.PAYPAL_CLIENT_ID)
// )

const __dirname = path.resolve()
app.use( '/uploads', express.static( path.join( __dirname, '/uploads' ) ) )

if ( process.env.NODE_ENV !== 'dev' ) {
  app.use( express.static('C:/Users/ulstu/Documents/GitHub/final-shorts-studio/client/build') ) 

  app.get( '*', ( req, res ) =>
    res.sendFile( path.resolve('C:/Users/ulstu/Documents/GitHub/final-shorts-studio/client/build/index.html' ) ) )

  app.use( '/', express.static( 'C:/Users/ulstu/Documents/GitHub/final-shorts-studio/client/build' ) )
}

app.use( notFound )
app.use( errorHandler )



app.listen(
  process.env.PORT || 80,
  console.log(
    `Server running in ${ process.env.NODE_ENV } mode on port ${ process.env.PORT }`.yellow.bold
  )
)
