import type { Request, Response } from 'express'

// Simulando o banco de dados de pedidos
let pedidos = [
  { id: 1, cliente: 'João Silva', servico: 'Reparo de Chuveiro', status: 'Aguardando' },
  { id: 2, cliente: 'Ana Lima', servico: 'Instalação Elétrica', status: 'Aguardando' }
]

// GET /pedidos
export function listarPedidos(req: Request, res: Response) {
  res.json(pedidos)
}

// PATCH /pedidos/:id/status
export function atualizarStatusPedido(req: Request, res: Response) {
  const id = Number(req.params.id)
  const { acao } = req.body // Espera receber 'aceitar' ou 'recusar'

  const pedido = pedidos.find(p => p.id === id)
  if (!pedido) {
    res.status(404).json({ erro: 'Pedido não encontrado.' })
    return
  }

  if (acao === 'aceitar') {
    pedido.status = 'Aceito'
    res.json({ mensagem: 'Pedido aceito com sucesso!', pedido })
  } else if (acao === 'recusar') {
    pedido.status = 'Recusado'
    res.json({ mensagem: 'Pedido recusado.', pedido })
  } else {
    res.status(400).json({ erro: 'Ação inválida. Envie "aceitar" ou "recusar".' })
  }
}