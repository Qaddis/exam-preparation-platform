import {
	Body,
	Controller,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AccessTokenDto } from "./dto/accessToken.dto"
import { AuthDto } from "./dto/auth.dto"
import { RefreshDto } from "./dto/refresh.dto"
import { RegisterDto } from "./dto/register.dto"

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// Верификация токена
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post("verify")
	verifyToken(@Body() dto: AccessTokenDto) {
		return this.authService.verifyToken(dto.accessToken)
	}

	// Обновление токенов
	@UsePipes(new ValidationPipe())
	@Post("new-tokens")
	getNewTokens(@Body() dto: RefreshDto) {
		return this.authService.getNewTokens(dto.refreshToken)
	}

	// Вход в существующий аккаунт
	@UsePipes(new ValidationPipe())
	@Post("sign-in")
	singIn(@Body() dto: AuthDto) {
		return this.authService.signIn(dto)
	}

	// Регистрация нового пользователя
	@UsePipes(new ValidationPipe())
	@Post("sign-up")
	signUp(@Body() dto: RegisterDto) {
		return this.authService.signUp(dto)
	}
}
