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

if ( process.env.NODE_ENV === 'dev' ) {
  app.use( morgan( 'dev' ) )
  app.get( '*', ( req, res ) => {
    res.send( '目前正在維護' )
  } )

}

app.use( express.json() )

app.use( '/api/products', productRoutes )
app.use( '/api/users', userRoutes )
app.use( '/api/orders', orderRoutes )
app.use( '/api/upload', uploadRoutes )

app.get( '/api/config/paypal', ( req, res ) =>
  res.send( process.env.PAYPAL_CLIENT_ID )
)

const __dirname = path.resolve()
console.log( __dirname + `/static` )
app.use( '/uploads', express.static( path.join( __dirname, '/uploads' ) ) )

app.use('*',express.static( path.join( __dirname, '/client/build' ) ) )
 app.use('/',express.static( path.join( __dirname, '/client/build' ) ) )
 app.use( express.static( path.join( __dirname, '/client/build' ) ) )


//

app.use( notFound )
app.use( errorHandler )

const PORT = process.env.PORT || 5005

app.listen(
  PORT,
  console.log(
    `Server running in ${ process.env.NODE_ENV } mode on port ${ PORT }`.yellow.bold
  )
)
process.on( 'uncaughtException', function ( err ) {
  console.log( err );
} );