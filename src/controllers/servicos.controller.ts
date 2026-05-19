import type { Request, Response } from 'express'
import {
  criarServicoDto,
  atualizarServicoDto,
  substituirServicoDto,
} from '../dtos/servico.dto'

type Servico = { id: number; titulo: string; categoria: string; valor: number }

// Banco de dados em memória
let servicos: Servico[] = [
  { id: 1, titulo: 'Manutenção de Ar Condicionado', categoria: 'Climatização', valor: 150.00 },
  { id: 2, titulo: 'Design de Marca', categoria: 'Design', valor: 500.00 },
]
let proximoId = 3

// GET /servicos
export function listarServicos(req: Request, res: Response) {
  res.json(servicos)
}

// GET /servicos/:id
export function buscarServico(req: Request, res: Response) {
  const id = Number(req.params.id)
  const servico = servicos.find(s => s.id === id)
  
  if (!servico) {
    res.status(404).json({ erro: 'Serviço não encontrado.' })
    return
  }
  res.json(servico)
}

// POST /servicos
export function criarServico(req: Request, res: Response) {
  const resultado = criarServicoDto.safeParse(req.body)
  
  if (!resultado.success) {
    res.status(400).json({ erros: resultado.error.flatten().fieldErrors })
    return
  }
  
  const { titulo, categoria, valor } = resultado.data
  const novo: Servico = { id: proximoId++, titulo, categoria, valor }
  
  servicos.push(novo)
  res.status(201).json(novo)
}

// PUT /servicos/:id
export function substituirServico(req: Request, res: Response) {
  const id = Number(req.params.id)
  const resultado = substituirServicoDto.safeParse(req.body)
  
  if (!resultado.success) {
    res.status(400).json({ erros: resultado.error.flatten().fieldErrors })
    return
  }
  
  const indice = servicos.findIndex(s => s.id === id)
  if (indice === -1) {
    res.status(404).json({ erro: 'Serviço não encontrado.' })
    return
  }
  
  servicos[indice] = { id, ...resultado.data }
  res.json(servicos[indice])
}

// PATCH /servicos/:id
export function atualizarServico(req: Request, res: Response) {
  const id = Number(req.params.id)
  const resultado = atualizarServicoDto.safeParse(req.body)
  
  if (!resultado.success) {
    res.status(400).json({ erros: resultado.error.flatten().fieldErrors })
    return
  }
  
  const servico = servicos.find(s => s.id === id)
  if (!servico) {
    res.status(404).json({ erro: 'Serviço não encontrado.' })
    return
  }
  
  Object.assign(servico, resultado.data)
  res.json(servico)
}

// DELETE /servicos/:id
export function removerServico(req: Request, res: Response) {
  const id = Number(req.params.id)
  const indice = servicos.findIndex(s => s.id === id)
  
  if (indice === -1) {
    res.status(404).json({ erro: 'Serviço não encontrado.' })
    return
  }
  
  servicos.splice(indice, 1)
  res.status(204).send()
}