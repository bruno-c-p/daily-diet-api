import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkSessionIdExists)
  app.get('/', async (request, reply) => {
    const meals = await knex('meals')
      .where({ user_id: request.user?.id })
      .orderBy('date', 'desc')
    return reply.send({ meals })
  })

  app.get('/:id', async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() })
    const { id } = paramsSchema.parse(request.params)
    const meal = await knex('meals')
      .where({ id, user_id: request.user?.id })
      .first()
    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found' })
    }
    return reply.send({ meal })
  })

  app.delete('/:id', async (request, reply) => {
    const paramsSchema = z.object({ id: z.string().uuid() })
    const { id } = paramsSchema.parse(request.params)
    const meal = await knex('meals')
      .where({ id, user_id: request.user?.id })
      .first()
    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found' })
    }
    await knex('meals').where({ id }).delete()
    return reply.status(204).send()
  })

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string().min(1, 'O nome é obrigatório'),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    })
    const { name, description, isOnDiet, date } = createMealBodySchema.parse(
      request.body,
    )
    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      is_on_diet: isOnDiet,
      date: date.getTime(),
      user_id: request.user?.id,
    })
    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = getMealParamsSchema.parse(request.params)
    const userId = request.user?.id
    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isOnDiet: z.boolean(),
      date: z.coerce.date(),
    })
    const { name, description, isOnDiet, date } = updateMealBodySchema.parse(
      request.body,
    )
    const meal = await knex('meals').where({ id, user_id: userId }).first()
    if (!meal) {
      return reply.status(404).send({ error: 'Meal not found' })
    }
    await knex('meals').where({ id }).update({
      name,
      description,
      is_on_diet: isOnDiet,
      date: date.getTime(),
    })
    return reply.status(204).send()
  })

  app.get('/metrics', async (request, reply) => {
    const totalMealsOnDiet = await knex('meals')
      .where({ user_id: request.user?.id, is_on_diet: true })
      .count('id', { as: 'total' })
      .first()
    const totalMealsOffDiet = await knex('meals')
      .where({ user_id: request.user?.id, is_on_diet: false })
      .count('id', { as: 'total' })
      .first()
    const totalMeals = await knex('meals')
      .where({ user_id: request.user?.id })
      .orderBy('date', 'desc')
    const { bestOnDietSequence } = totalMeals.reduce(
      (acc, meal) => {
        if (meal.is_on_diet) {
          acc.currentSequence += 1
        } else {
          acc.currentSequence = 0
        }
        if (acc.currentSequence > acc.bestOnDietSequence) {
          acc.bestOnDietSequence = acc.currentSequence
        }
        return acc
      },
      { bestOnDietSequence: 0, currentSequence: 0 },
    )
    return reply.send({
      totalMeals: totalMeals.length,
      totalMealsOnDiet: totalMealsOnDiet?.total,
      totalMealsOffDiet: totalMealsOffDiet?.total,
      bestOnDietSequence,
    })
  })
}
