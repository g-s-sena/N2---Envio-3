import express from 'express'
import cors from 'cors'
import servicosRouter from './routes/servicos.routes'
import prestadoresRouter from './routes/prestadores.routes'
import pedidosRouter from './routes/pedidos.routes'
import authRouter from './routes/auth.routes' // <-- Nova importação
import { verificarToken } from './middlewares/auth.middleware' // <-- Nova importação

const app = express()
const port = 3000

app.use(express.json())
const app = express()
app.use(cors())

// Rotas Públicas (não requerem autenticação)
app.use('/auth', authRouter)
app.use('/servicos', servicosRouter)
app.use('/prestadores', prestadoresRouter)

// Rotas Protegidas (requerem o token)
// O middleware verificarToken é injetado antes do router
app.use('/pedidos', verificarToken, pedidosRouter)

app.listen(port, () => {
  console.log(`Servidor a correr em http://localhost:${port}`)
})