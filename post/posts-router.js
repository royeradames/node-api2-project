const express = require('express')
var db = require('../data/db')
const router = express.Router()
// '/api/post' + 'router url from here' 
router.get('/', async (req, res) => {
    let posts
    await db.find()
        .then(resp => {
            posts = resp
        })
    res.status(200).json(posts)
})
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id)
    let post
    await db.findById(id)
        .then(resp => {
            post = resp
        })
    res.status(200).json(post)
})

// having trouble understanding how comments and posts are jointing
router.get('/api/posts/:id/comments', async (req, res) => {
    const id = Number(req.params.id)
    let comments
    await db.findPostComments(id)
        .then(resp => {
            comments = resp
        })
    res.status(200).json(comments)
})
router.post('/:id/comments', async (req, res) => {
    try {
        //id not found return 404 { message: "The post with the specified ID does not exist." }
        const id = req.params.id
        let idIsFound
        await db.findById(id)
            .then(resp => {
                // If the request body is missing the text property
                // 400 { errorMessage: "Please provide text for the comment." }
                const newComment = {
                    text: req.body.text,
                    post_id: req.body.post_id
                }
                if (!newComment.text) res.status(400).json({ errorMessage: "Please provide text for the comment." })

                // If the information about the comment is valid: 
                // 201 return the newly created comment.

                res.status(201).json(db.insertComment(newComment))
            })
            .catch(() => {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            })





    } catch (error) {
        res.status(500).json({ error: "There was an error while saving the comment to the database" })

    }
})

router.post('/', async (req, res) => {
    // Creates a post using the information sent inside the request body
    try {
        // const posts = db.find()
        let posts
        await db.find()
            .then(resp => {
                posts = resp
            })
        const newPost = {
            title: req.body.title,
            contents: req.body.contents,
        }

        //title and contents most be pass down if not return an error
        if (!newPost.title || !newPost.contents) {
            res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' })
        }
        //add new post
        posts.push(newPost)
        // return post
        res.status(201).json(posts)
    } catch (error) {
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    }
})

router.put('/:id', async (req, res) => {

    try {
        const id = Number(req.params.id)
        let post
        await db.findById(id)
            .then(resp => {
                post = resp

                const updateComment = {
                    title: req.body.title,
                    contents: req.body.contents,
                }
                if (!updateComment.title || !updateComment.contents) res.status(400).json({ errorMessage: "Please provide title and contents for the post." })

                // If the information about the comment is valid: 
                // 201 return the newly created comment.
                db.update(id,)
                res.status(201).json(db.insertComment(newComment))
            })
            .catch(() => {
                res.status(400).json({ message: "The post with the specified ID does not exist." })
            })
    } catch (error) {
        res.status(500).json({ error: "The post information could not be modified." })

    }

})


module.exports = router