import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'), // ENUM => Uma entre algumas opções
    PORT: z.coerce.number().default(3333), // Coerce converte para o tipo que é informado após ele
})

const _env = envSchema.safeParse(process.env) // SafeParse vai tentar validar a variavel env se contêm as informações acima

if (_env.success ===  false) { // Verificar se a validação acima teve sucesso
    console.error('⚠ Invalid environmnet variables', _env.error.format())

    throw new Error('Invalid environment variables.')
}

export const env = _env.data