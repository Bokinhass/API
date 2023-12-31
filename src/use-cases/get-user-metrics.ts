import { CheckInsRepository } from '../repositories/check-ins-repository'

interface GetUserMetricUseCaseRequest {
  userId: string
}

interface GetUserMetricUseCaseResponse {
  checkInsCount: number
}

export class GetUserMetricUseCaseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricUseCaseRequest): Promise<GetUserMetricUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
