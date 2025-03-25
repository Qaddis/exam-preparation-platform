import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { hash } from "argon2"
import { PrismaService } from "src/prisma.service"
import { ProfileDto } from "./dto/profile.dto"

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	// Поиск пользователя по id и выбор конкретных полей
	private async byId(userId: string, selectedObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId
			},
			select: {
				id: true,
				email: true,
				role: true,
				name: true,
				classrooms: {
					select: {
						id: true,
						name: true,
						teacher: {
							select: {
								name: true
							}
						}
					}
				},
				teaching: {
					select: {
						id: true,
						name: true
					}
				},
				...selectedObject
			}
		})

		if (!user) throw new NotFoundException("User not found")

		return user
	}

	// Получить профиль
	async getProfile(userId: string) {
		return await this.byId(userId)
	}

	// Изменить профиль
	async updateProfile(userId: string, dto: ProfileDto) {
		const sameUser = await this.prisma.user.findUnique({
			where: { email: dto.email }
		})

		if (sameUser && userId !== sameUser.id)
			throw new BadRequestException("This email is already in use")

		const user = await this.byId(userId, { password: true })

		return await this.prisma.user.update({
			where: {
				id: user.id
			},
			data: {
				email: dto.email,
				password: dto.password ? await hash(dto.password) : user.password,
				name: dto.name ? dto.name : user.name
			}
		})
	}

	// Удалить профиль
	async deleteProfile(userId: string) {
		const user = await this.byId(userId)

		try {
			await this.prisma.user.delete({
				where: {
					id: user.id
				}
			})

			return "ok"
		} catch {
			throw new InternalServerErrorException("Error. Try again later")
		}
	}
}
