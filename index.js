import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
import { nanoid } from "nanoid"

mongoose
  .connect(process.env.MONGODB_STRING)
  .then(() => console.log("Connected!"))

const port = 8000
const app = express()

app.use(cors())
app.use(express.json())

const listSchema = new mongoose.Schema({
  _id: String,
  list: String,
  done: Boolean,
})

const List = mongoose.model("List", listSchema)

app.get("/list", async (req, res) => {
  const lists = await List.find()
  res.json(lists)
})

app.post("/list", async (req, res) => {
  const { list } = req.body
  const newCategory = new List({
    _id: nanoid(),
    list: list,
    done: false,
  })
  const result = await newCategory.save()
  res.sendStatus(201)
})

app.delete("/list/:id", (req, res) => {
  const { id } = req.params
  List.deleteOne({ _id: id }).then(() => {
    res.json({ deletedId: id })
  })
})

app.put("/list/:id", (req, res) => {
  const { id } = req.params
  const { list } = req.body
  const { done } = req.body
  List.updateOne({ _id: id }, { list: list, done: done }).then(() => {
    res.json({ updatedId: id })
  })
})

app.listen(port, () => {
  console.log("App is listering at port", port)
})
