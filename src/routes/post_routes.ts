import express from 'express'
const router = express.Router()
import Post from '../controllers/post'
import authenticate from '../common/auth_middleware'


router.get('/',Post.getAllPosts)

router.post('/',authenticate,Post.createNewPost)

router.get('/:id',Post.getPostById)

router.delete('/:id',authenticate,Post.deletePostById)
router.delete('/',authenticate,Post.deletePostById)


router.post('/updateMessage/:id',authenticate,Post.updatePostMessageById)
router.post('/updateMessage/',authenticate,Post.updatePostMessageById)

export = router
