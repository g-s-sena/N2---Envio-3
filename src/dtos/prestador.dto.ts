import { z } from 'zod'

// Schema do Zod para criar um prestador (baseado no teu fluxo de registo)
export const criarPrestadorDto = z.object({
  nome: z.string({
    error: issue =>
      issue.input === undefined
        ? 'O campo nome é obrigatório.'
        : 'O nome deve ser um texto.',
  }).min(3, 'O nome deve ter ao menos 3 caracteres.'),
  
  email: z.string({
    error: issue =>
      issue.input === undefined
        ? 'O campo e-mail é obrigatório.'
        : 'O e-mail deve ser um texto.',
  }).email('O formato do e-mail é inválido.'),
  
  cpf_cnpj: z.string({
    error: issue =>
      issue.input === undefined
        ? 'O campo CPF/CNPJ é obrigatório.'
        : 'O CPF/CNPJ deve ser um texto.',
  }).min(11, 'O documento deve ter pelo menos 11 dígitos.'),

  senha: z.string({
    error: issue =>
      issue.input === undefined
        ? 'O campo senha é obrigatório.'
        : 'A senha deve ser um texto.',
  }).min(6, 'A senha deve ter no mínimo 6 caracteres.'),
})

// Schema para PATCH (torna todos os campos opcionais)
export const atualizarPrestadorDto = criarPrestadorDto.partial()

// Schema para PUT (exige todos os campos)
export const substituirPrestadorDto = criarPrestadorDto

// Tipos TypeScript inferidos automaticamente do Zod
export type CriarPrestadorDto = z.infer<typeof criarPrestadorDto>
export type AtualizarPrestadorDto = z.infer<typeof atualizarPrestadorDto>
export type SubstituirPrestadorDto = z.infer<typeof substituirPrestadorDto>