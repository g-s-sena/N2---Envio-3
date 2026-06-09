import type { Request, Response } from 'express'
import {
  criarPrestadorDto,
  atualizarPrestadorDto,
  substituirPrestadorDto,
} from '../dtos/prestador.dto'

// Estrutura do Prestador
type Prestador = { 
  id: number; 
  nome: string; 
  email: string; 
  cpf_cnpj: string; 
  senha?: string; // Opcional no retorno por segurança
}

// Banco de dados em memória para prestadores
let prestadores: Prestador[] = []
let proximoId = 1

// GET /prestadores
export function listarPrestadores(req: Request, res: Response) {
  // Retorna todos os prestadores (removendo a senha por segurança)
  const prestadoresSemSenha = prestadores.map(({ senha, ...resto }) => resto)
  res.json(prestadoresSemSenha)
}

// GET /prestadores/:id
export function buscarPrestador(req: Request, res: Response) {
  const id = Number(req.params.id)
  const prestador = prestadores.find(p => p.id === id)
  
  if (!prestador) {
    res.status(404).json({ erro: 'Prestador não encontrado.' })
    return
  }
  
  const { senha, ...prestadorSemSenha } = prestador
  res.json(prestadorSemSenha)
}

// POST /prestadores
export function criarPrestador(req: Request, res: Response) {
  const resultado = criarPrestadorDto.safeParse(req.body)
  
  if (!resultado.success) {
    res.status(400).json({ erros: resultado.error.flatten().fieldErrors })
    return
  }
  
  const { nome, email, cpf_cnpj, senha } = resultado.data
  const novo: Prestador = { id: proximoId++, nome, email, cpf_cnpj, senha }
  
  prestadores.push(novo)
  
  // Não retornamos a senha na resposta de sucesso
  const { senha: _, ...prestadorCriado } = novo
  res.status(201).json(prestadorCriado)
}

// PUT /prestadores/:id
export function substituirPrestador(req: Request, res: Response) {
  const id = Number(req.params.id)
  const resultado = substituirPrestadorDto.safeParse(req.body)
  
  if (!resultado.success) {
    res.status(400).json({ erros: resultado.error.flatten().fieldErrors })
    return
  }
  
  const indice = prestadores.findIndex(p => p.id === id)
  if (indice === -1) {
    res.status(404).json({ erro: 'Prestador não encontrado.' })
    return
  }
  
  prestadores[indice] = { id, ...resultado.data }
  
  const { senha, ...prestadorAtualizado } = prestadores[indice]
  res.json(prestadorAtualizado)
}

// PATCH /prestadores/:id
export function atualizarPrestador(req: Request, res: Response) {
  const id = Number(req.params.id)
  const resultado = atualizarPrestadorDto.safeParse(req.body)
  
  if (!resultado.success) {
    res.status(400).json({ erros: resultado.error.flatten().fieldErrors })
    return
  }
  
  const prestador = prestadores.find(p => p.id === id)
  if (!prestador) {
    res.status(404).json({ erro: 'Prestador não encontrado.' })
    return
  }
  
  Object.assign(prestador, resultado.data)
  
  const { senha, ...prestadorAtualizado } = prestador
  res.json(prestadorAtualizado)
}

// DELETE /prestadores/:id
export function removerPrestador(req: Request, res: Response) {
  const id = Number(req.params.id)
  const indice = prestadores.findIndex(p => p.id === id)
  
  if (indice === -1) {
    res.status(404).json({ erro: 'Prestador não encontrado.' })
    return
  }
  
  prestadores.splice(indice, 1)
  res.status(204).send()
}