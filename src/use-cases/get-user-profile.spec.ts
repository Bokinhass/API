import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

describe('Get User Profile Use Case', () => {
  it('should be able to get user profile', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new GetUserProfileUseCase(usersRepository)

    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id
    })

    expect(user.id).toEqual(expect.any(String))
    // expect(user.name).toEqual('Jhon Doe')   bug bug bug bug
  })

  it('should be able to get user profile with wrong id', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new GetUserProfileUseCase(usersRepository)

    await expect(() => sut.execute({
      userId: 'non-existing-id',
    })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
