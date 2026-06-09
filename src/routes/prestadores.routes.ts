import { Router } from 'express'
import {
  listarPrestadores,
  buscarPrestador,
  criarPrestador,
  substituirPrestador,
  atualizarPrestador,
  removerPrestador,
} from '../controllers/prestadores.controller'

const router = Router()

router.get('/', listarPrestadores)
router.get('/:id', buscarPrestador)
router.post('/', criarPrestador)
router.put('/:id', substituirPrestador)
router.patch('/:id', atualizarPrestador)
router.delete('/:id', removerPrestador)

export default router