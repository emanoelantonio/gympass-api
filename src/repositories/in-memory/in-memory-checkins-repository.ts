import type { Checkin, Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import type { CheckInsRepository } from '../check-ins-repository';

export class InMemoryCheckInRepository implements CheckInsRepository {
	public items: Checkin[] = [];

	async create(data: Prisma.CheckinUncheckedCreateInput) {
		const checkIn = {
			id: randomUUID(),
			user_id: data.user_id,
			gym_id: data.gym_id,
			created_at: new Date(),
			validated_at: data.validated_at ? new Date(data.validated_at) : null,
		};

		this.items.push(checkIn);

		return checkIn;
	}
}
