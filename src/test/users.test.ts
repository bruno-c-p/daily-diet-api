import { execSync } from 'node:child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../app'

describe('Users routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:latest')
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new user', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'New User',
        email: 'new.user@user.com',
      })
      .expect(201)
    const cookies = response.get('Set-Cookie')
    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
  })

  it('should return bad request when creating user with existing email', async () => {
    const email = 'new.user@user.com'
    await request(app.server).post('/users').send({
      name: 'New User',
      email,
    })
    const createUserWithExistingEmailResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'New User',
        email,
      })
      .expect(400)
    expect(createUserWithExistingEmailResponse.body.message).toBe(
      'User already exists',
    )
  })
})
