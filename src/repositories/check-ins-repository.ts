import { ChekIn, Prisma } from '@prisma/client';

export interface CheckInsRepository {
  create(data: Prisma.ChekInUncheckedCreateInput): Promise<ChekIn>
}
