import express, { Request, Response } from 'express'
import mongoose from "mongoose"
import path from 'path'
import dotenv from 'dotenv'
import File from './models'
dotenv.config()

const app = express()

// Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('./client/build'))

//MongoDB database
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI as string)
  console.log('Connected to MongoDB successfully!')
}
connectDB()

// Routes
app.get('/home', (req: Request, res: Response) => {
  console.log('Hello from home route!')
  res.send('Hello from home route!')
})

app.get('/images', async (req: Request, res: Response) => {
  try {
    const results = await File.find({})
    const files = results.map(result => (result.fileName))    
    res.status(200).json(files)
  } 
  catch (error) {
    res.send(`error, something went wrong: ${error}`)
  } 
})

// This must be the last route otherwise it will block all other routes.
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"))
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in on port ${PORT}`))