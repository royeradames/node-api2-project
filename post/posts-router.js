const express = require('express')
var db = require('../data/db')
const router = express.Router()
// '/api/post' + 'router url from here' 
router.get('/', (req, res) => {
    try {
        db.find()
            .then(posts => {
                res.status(200).json(posts)

            })
    } catch (error) {
        res.status(500).json({ error: "The posts information could not be retrieved." })

    }
})
router.get('/:id', (req, res) => {

    try {
        const id = Number(req.params.id)
        db.findById(id)
            .then(post => {
                const isPostFound = post.length > 0
                if (!isPostFound) {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                } else {
                    res.status(200).json(post)
                }
            })
    } catch (error) {
        res.status(500).json({error: "The post information could not be retrieved."})

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
            .then(() => {

                const updateComment = {
                    title: req.body.title,
                    contents: req.body.contents,
                }
                if (!updateComment.title || !updateComment.contents) res.status(400).json({ errorMessage: "Please provide title and contents for the post." })

                // If the information about the comment is valid: 
                // 201 return the newly created comment.
                db.update(id, updateComment)
                    .then(() => {
                        //return the updated post
                        db.findById(id)
                            .then((updatedPost) => {
                                res.status(201).json(updatedPost)
                            })
                    })
                    .catch((err) => {
                        res.status(400).json(err)

                    })
            })
            .catch(() => {
                res.status(400).json({ message: "The post with the specified ID does not exist." })
            })
    } catch (error) {
        res.status(500).json({ error: "The post information could not be modified." })

    }

})
router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        db.remove(id)
            .then(() => {
                res.status(204).end()
            })
            .catch(() => {
                res.status(400).json({ error: "The post could not be removed" })

            })
    } catch (error) {
        res.status(500).json({ error: "The comments information could not be retrieved." })

    }
})

// having trouble understanding how comments and posts are jointing
router.get('/:id/comments', (req, res) => {
    try {
        const id = Number(req.params.id)
        db.findPostComments(id)
            .then(comments => {
                const noComments = comments.length === 0

                if (noComments) res.status(404).json({ message: "The post with the specified ID does not exist or there is no comments." })

                res.status(200).json(comments)

            })

    } catch (error) {
        res.status(500).json({ error: "The comments information could not be retrieved." })

    }

})
router.post('/:id/comments', async (req, res) => {
    try {
        //id not found return 404 { message: "The post with the specified ID does not exist." }
        const id = Number(req.params.id)
        await db.findById(id)
            .then(post => {
                const isPostFound = post.length > 0
                if (!isPostFound) {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })

        // If the request body is missing the text property
        // 400 { errorMessage: "Please provide text for the comment." }
        const newComment = {
            text: String(req.body.text),
            post_id: String(req.body.post_id),
        }
        if (!newComment.text) res.status(400).json({ errorMessage: "Please provide text for the comment." })
        // If the information about the comment is valid: 
        // 201 return the newly created comment.
        db.insertComment(newComment)
            .then((comment) => {
                console.log(comment)
                db.findCommentById(comment.id)
                    .then((updatedComment) => {
                        console.log(updatedComment)
                        res.status(201).json(updatedComment)
                    })
            })

    } catch (error) {
        res.status(500).json({ error: "There was an error while saving the comment to the database" })

    }
})

module.exports = router