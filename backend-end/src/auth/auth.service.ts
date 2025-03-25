import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { User } from "@prisma/client"
import { hash, verify } from "argon2"
import { PrismaService } from "src/prisma.service"
import { AuthDto } from "./dto/auth.dto"
import { RegisterDto } from "./dto/register.dto"

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService
	) {}

	// Получение из объекта пользователя нужных полей
	private returnUserFields(user: User) {
		return { id: user.id, email: user.email, name: user.name, role: user.role }
	}

	// Генерация пары токенов
	private issueTokens(userId: string) {
		const data = { id: userId }

		const accessTokens: string = this.jwt.sign(data, {
			expiresIn: "1h"
		})

		const refreshToken: string = this.jwt.sign(data, {
			expiresIn: "7d"
		})

		return { accessTokens, refreshToken }
	}

	// Обновление токенов
	async getNewTokens(refreshToken: string) {
		let verify

		try {
			verify = await this.jwt.verifyAsync(refreshToken)
		} catch {
			throw new UnauthorizedException("Invalid refresh token")
		} finally {
			if (!verify) throw new UnauthorizedException("Invalid refresh token")
		}

		const user = await this.prisma.user.findUnique({
			where: {
				id: verify.id
			}
		})
		if (!user) throw new NotFoundException("User not found")

		const tokens = this.issueTokens(user.id)

		return { data: this.returnUserFields(user), ...tokens }
	}

	// Вход в существующий аккаунт
	async signIn(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (!user) throw new NotFoundException("User not found")

		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException("Invalid password")

		const tokens = this.issueTokens(user.id)

		return { data: this.returnUserFields(user), ...tokens }
	}

	// Регистрация нового пользователя
	async signUp(dto: RegisterDto) {
		const oldUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})
		if (oldUser) throw new BadRequestException("User already exist")

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				password: await hash(dto.password),
				name: dto.name,
				role: dto.role
			}
		})

		const tokens = this.issueTokens(user.id)

		return { data: this.returnUserFields(user), ...tokens }
	}
}
