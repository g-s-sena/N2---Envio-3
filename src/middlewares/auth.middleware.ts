import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const SECRET_KEY = 'minha_chave_secreta_super_segura'

export function verificarToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' })
    return 
  }

  // O cabeçalho é do tipo "Bearer meutoken123", por isso separamos pelo espaço
  const token = authHeader.split(' ')[1] 

  try {
    const payload = jwt.verify(token, SECRET_KEY)
    
    // (Opcional) Guardar a informação do payload no request
    // (req as any).usuario = payload;
    
    next() // Tudo certo, continua para o controller
  } catch (error) {
    res.status(401).json({ erro: 'Token inválido ou expirado.' })
  }
}