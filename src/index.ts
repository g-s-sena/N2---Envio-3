import express from 'express'
import servicosRouter from './routes/servicos.routes'

const app = express()
const port = 3000

app.use(express.json())
app.use('/servicos', servicosRouter)

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})