import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
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
export let prestadores: Prestador[] = []
let proximoId = 1

// ==========================================
// INJEÇÃO DO UTILIZADOR DE TESTE
// ==========================================
// Assim que o servidor liga, este utilizador é criado automaticamente
const saltTeste = bcrypt.genSaltSync(10)
prestadores.push({
  id: proximoId++,
  nome: 'Carlos Teste',
  email: 'teste@teste.com',
  cpf_cnpj: '11122233344',
  senha: bcrypt.hashSync('123456', saltTeste) // A senha para entrar será "123456"
})
// ==========================================


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
export async function criarPrestador(req: Request, res: Response) {
  const resultado = criarPrestadorDto.safeParse(req.body)
  
  if (!resultado.success) {
    res.status(400).json({ erros: resultado.error.flatten().fieldErrors })
    return
  }
  
  const { nome, email, cpf_cnpj, senha } = resultado.data
  
  // Encriptar a senha
  const salt = await bcrypt.genSalt(10)
  const senhaHash = await bcrypt.hash(senha, salt)

  const novo: Prestador = { id: proximoId++, nome, email, cpf_cnpj, senha: senhaHash }
  
  prestadores.push(novo)
  
  // Não retornamos a senha na resposta de sucesso
  const { senha: _, ...prestadorCriado } = novo
  res.status(201).json(prestadorCriado)
}

// PUT /prestadores/:id
export async function substituirPrestador(req: Request, res: Response) {
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
  
  // Como é PUT (substituição completa), tem sempre senha, logo encriptamos
  const salt = await bcrypt.genSalt(10)
  const senhaHash = await bcrypt.hash(resultado.data.senha, salt)

  prestadores[indice] = { id, ...resultado.data, senha: senhaHash }
  
  const { senha, ...prestadorAtualizado } = prestadores[indice]
  res.json(prestadorAtualizado)
}

// PATCH /prestadores/:id
export async function atualizarPrestador(req: Request, res: Response) {
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
  
  const dadosAtualizados = { ...resultado.data }

  // Se a requisição enviou uma nova senha, também precisamos encriptá-la
  if (dadosAtualizados.senha) {
    const salt = await bcrypt.genSalt(10)
    dadosAtualizados.senha = await bcrypt.hash(dadosAtualizados.senha, salt)
  }

  Object.assign(prestador, dadosAtualizados)
  
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