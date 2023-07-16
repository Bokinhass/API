import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInsUseCase } from '../check-in'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInsUseCase(checkInsRepository, gymsRepository)

  return useCase
}
