import { z } from 'zod'

// Schema do Zod para criar um serviço
export const criarServicoDto = z.object({
  titulo: z.string({
    error: issue =>
      issue.input === undefined
        ? 'O campo título é obrigatório.'
        : 'O título deve ser um texto.',
  }).min(3, 'O título deve ter ao menos 3 caracteres.'),
  
  categoria: z.string({
    error: issue =>
      issue.input === undefined
        ? 'O campo categoria é obrigatório.'
        : 'A categoria deve ser um texto.',
  }),
  
  valor: z.number({
    error: issue =>
      issue.input === undefined
        ? 'O campo valor é obrigatório.'
        : 'O valor deve ser um número.',
  }).positive('O valor deve ser maior que zero.'),
})

// Schema para PATCH (torna todos os campos opcionais)
export const atualizarServicoDto = criarServicoDto.partial()

// Schema para PUT (exige todos os campos)
export const substituirServicoDto = criarServicoDto

// Tipos TypeScript inferidos automaticamente do Zod
export type CriarServicoDto = z.infer<typeof criarServicoDto>
export type AtualizarServicoDto = z.infer<typeof atualizarServicoDto>
export type SubstituirServicoDto = z.infer<typeof substituirServicoDto>