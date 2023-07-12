import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { expect, describe, it } from 'vitest'
import { CheckInsUseCase } from './check-in'

describe('Register Use Case', () => {
  it('should be able to check in', async () => {
    const checkInsRepository = new InMemoryCheckInsRepository()
    const sut = new CheckInsUseCase(checkInsRepository)

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
