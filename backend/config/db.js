import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB || 'mongodb://uximidpugr4r4zg1put8:gKYe2UqjXEXlThBNpk3c@bvdm7dfn2mr2hia-mongodb.services.clever-cloud.com:27017/bvdm7dfn2mr2hia', {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold)
    process.exit(1)
  }
}

export default connectDB
