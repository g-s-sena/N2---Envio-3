import { Router } from 'express'
import {
  listarServicos,
  buscarServico,
  criarServico,
  substituirServico,
  atualizarServico,
  removerServico,
} from '../controllers/servicos.controller'

const router = Router()

router.get('/', listarServicos)
router.get('/:id', buscarServico)
router.post('/', criarServico)
router.put('/:id', substituirServico)
router.patch('/:id', atualizarServico)
router.delete('/:id', removerServico)

export default router