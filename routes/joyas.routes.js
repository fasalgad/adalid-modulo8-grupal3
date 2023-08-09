import {
  getJoyas,
  createJoyas,
  putJoyas,
  getJoyasPorMaterial,
  deleteJoyas,
  getJoyasPorNombre,
  getJoyasPorId 
} from '../controllers/joyas.controllers.js'
import { Router } from 'express'

const router = Router()

router.get('/', getJoyas)
router.get('/:id', getJoyasPorId)
router.get('/material/:material', getJoyasPorMaterial)
router.get('/nombre/:nombre/:order?', getJoyasPorNombre)
router.post('/', createJoyas)
router.put('/:id', putJoyas) 
router.delete('/:id', deleteJoyas)

export default router
