import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'

export const updateReceita = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const paramsSchema = z.object({
            id: z.string().uuid('ID da receita inválido')
        })

        const updateReceitaSchema = z.object({
            name: z.string().min(1, 'O nome é obrigatório').optional(),
            description: z.string().optional(),
            valor: z.number().positive('O valor deve ser positivo').optional(),
            data: z.string().datetime('Data inválida').optional(),
            categoria: z.string().min(1, 'A categoria é obrigatória').optional()
        })

        const { id } = paramsSchema.parse(request.params)
        const updateData = updateReceitaSchema.parse(request.body)

        // Verifica se a receita existe
        const receita = await prisma.receita.findUnique({
            where: { id },
            include: { carteira: true }
        })

        if (!receita) {
            return reply.status(404).send({ error: 'Receita não encontrada' })
        }

        // Se o valor foi atualizado, ajusta o saldo da carteira
        if (updateData.valor) {
            const valorAntigo = Number(receita.valor)
            const diferenca = updateData.valor - valorAntigo

            // Atualiza a receita e o saldo da carteira em uma transação
            const { receita: receitaAtualizada, carteira } = await prisma.$transaction(async (tx) => {
                const receita = await tx.receita.update({
                    where: { id },
                    data: {
                        name: updateData.name,
                        description: updateData.description,
                        valor: updateData.valor.toString(),
                        data: updateData.data ? new Date(updateData.data) : undefined,
                        categoria: updateData.categoria
                    }
                })

                const novoSaldo = Number(receita.carteira.balance) + diferenca
                const carteira = await tx.carteira.update({
                    where: { id: receita.carteiraId },
                    data: { balance: novoSaldo.toString() }
                })

                return { receita, carteira }
            })

            return reply.status(200).send({
                receita: {
                    id: receitaAtualizada.id,
                    name: receitaAtualizada.name,
                    description: receitaAtualizada.description,
                    valor: receitaAtualizada.valor,
                    data: receitaAtualizada.data,
                    categoria: receitaAtualizada.categoria,
                    carteiraId: receitaAtualizada.carteiraId,
                    created_at: receitaAtualizada.created_at
                },
                carteira: {
                    id: carteira.id,
                    balance: carteira.balance
                }
            })
        } else {
            // Se o valor não foi atualizado, apenas atualiza a receita
            const receitaAtualizada = await prisma.receita.update({
                where: { id },
                data: {
                    name: updateData.name,
                    description: updateData.description,
                    data: updateData.data ? new Date(updateData.data) : undefined,
                    categoria: updateData.categoria
                }
            })

            return reply.status(200).send({
                receita: {
                    id: receitaAtualizada.id,
                    name: receitaAtualizada.name,
                    description: receitaAtualizada.description,
                    valor: receitaAtualizada.valor,
                    data: receitaAtualizada.data,
                    categoria: receitaAtualizada.categoria,
                    carteiraId: receitaAtualizada.carteiraId,
                    created_at: receitaAtualizada.created_at
                }
            })
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            return reply.status(400).send({ error: error.errors })
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' })
    }
} 