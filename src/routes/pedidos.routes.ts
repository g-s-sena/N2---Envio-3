import { Router } from 'express'
import { listarPedidos, atualizarStatusPedido } from '../controllers/pedidos.controller'

const router = Router()

router.get('/', listarPedidos)
router.patch('/:id/status', atualizarStatusPedido)

export default router