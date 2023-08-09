import { 
  uploadImgJoyas,
  updateImgJoyas,
  getImages
} from '../controllers/images.controllers.js'
import { Router } from 'express'

const router = Router() 
router.post('/upload/:id', uploadImgJoyas)
router.put('/upload/:id', updateImgJoyas)
router.get('/images/:id?', getImages)
router.get('/images/:id/:name?', getImages)
export default router