import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { User } from '../models/User/User.js'

// get all users
export const getUsers = async (req, res) => {
  const users = await User.find({})
  res.status(200).json(users)
}

// get a single user - can be separate checks, but they made the same thing
export const getUser = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such user' })
  }

  const user = await User.findById(id)

  if (!user) {
    return res.status(404).json({ error: 'No such user' })
  }

  res.status(200).json(user)
}

// create a new user
export const createUser = async (req, res) => {
  const { username, avatar, email, password, registerdate } = req.body

  try {
    const user = await User.findOne({ email, username })

    if (user) {
      res.status(400).json({ error: 'User already exists' })
    }

    user = await User.create({
      username,
      avatar,
      email,
      password,
      registerdate,
    })

    const salt = bcrypt.genSalt(10)

    user.password = bcrypt.hash(password, salt)

    await user.save()

    res.status(200).json(newUser)

    res.send('User registered')
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such user' })
  }

  const user = await User.findByIdAndDelete(id)

  if (!user) {
    return res.status(404).json({ error: 'No such user' })
  }

  res.status(200).json(user)
}
// update user
export const editUser = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such user' })
  }

  const user = await User.findByIdAndUpdate(id, { ...req.body })

  if (!user) {
    return res.status(404).json({ error: 'No such user' })
  }

  res.status(200).json(user)
}
