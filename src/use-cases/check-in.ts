import { ChekIn } from '@prisma/client'
import { CheckInsRepository } from '../repositories/check-ins-repository';

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: ChekIn
}

export class CheckInsUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository
  ) { }

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
