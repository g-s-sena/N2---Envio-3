import express from 'express'
import servicosRouter from './routes/servicos.routes'
import prestadoresRouter from './routes/prestadores.routes'
import pedidosRouter from './routes/pedidos.routes' // <-- Nova linha

const app = express()
const port = 3000

app.use(express.json())

app.use('/servicos', servicosRouter)
app.use('/prestadores', prestadoresRouter)
app.use('/pedidos', pedidosRouter) // <-- Nova linha

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})