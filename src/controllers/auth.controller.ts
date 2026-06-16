import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prestadores } from './prestadores.controller'

const SECRET_KEY = 'minha_chave_secreta_super_segura'

export async function login(req: Request, res: Response) {
  const { email, senha } = req.body

  if (!email || !senha) {
    res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' })
    return
  }

  // Procura o prestador pelo email
  const prestador = prestadores.find(p => p.email === email)

  if (!prestador || !prestador.senha) {
    res.status(401).json({ erro: 'E-mail ou senha incorretos.' })
    return
  }

  // Compara a senha enviada no corpo do pedido com a hash guardada
  const senhaValida = await bcrypt.compare(senha, prestador.senha)

  if (!senhaValida) {
    res.status(401).json({ erro: 'E-mail ou senha incorretos.' })
    return
  }

  // Gera o token JWT (expira em 2 horas)
  const token = jwt.sign(
    { id: prestador.id, email: prestador.email }, 
    SECRET_KEY, 
    { expiresIn: '2h' } 
  )

  res.json({
    mensagem: 'Login realizado com sucesso!',
    token,
    prestador: { id: prestador.id, nome: prestador.nome, email: prestador.email }
  })
}