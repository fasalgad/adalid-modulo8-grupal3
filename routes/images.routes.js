import { 
  uploadImgJoyas,
  getImages
} from '../controllers/images.controllers.js'
import { Router } from 'express'

const router = Router() 
router.post('/upload/:id', uploadImgJoyas)
router.get('/images/:id?', getImages)
router.get('/images/:id/:name?', getImages)
export default router