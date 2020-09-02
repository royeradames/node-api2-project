// https://github.com/royeradames/node-api2-project.git


//this is pulling the dependency from 'node_modules' now, instead of the stdlib
const express = require('express')
var cors = require('cors')
const port = 8080

const postRouter = require('./post/posts-router')
//creates a new express server
const server = express()

// installing some middleware that helps us parse JSON request bodies.
// we'll talk about this later, just copu it over for now
server.use(express.json())
server.use(cors())
server.use('/api/posts', postRouter)


server.get('/', (req, res) => {
    res.json({ message: 'Welcome to the blog posts api' }) //? why JSON (javascript object notation) instead of html? Is more consitent than html. JSON is the standard format of send data back and fort 
})

server.listen(port, () => {//8080 is a standard to write local services
    console.log(`Server started on port ${port}`)
})