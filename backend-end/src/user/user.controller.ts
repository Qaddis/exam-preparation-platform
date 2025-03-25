import {
	Body,
	Controller,
	Delete,
	Get,
	Put,
	UsePipes,
	ValidationPipe
} from "@nestjs/common"
import { Auth } from "src/auth/decorators/auth.decorator"
import { CurrentUser } from "src/auth/decorators/user.decorator"
import { ProfileDto } from "./dto/profile.dto"
import { UserService } from "./user.service"

@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {}

	// Получить профиль
	@Get("profile")
	@Auth()
	getProfile(@CurrentUser("id") id: string) {
		return this.userService.getProfile(id)
	}

	// Изменить профиль
	@UsePipes(new ValidationPipe())
	@Put("profile")
	@Auth()
	updateProfile(@CurrentUser("id") id: string, @Body() dto: ProfileDto) {
		return this.userService.updateProfile(id, dto)
	}

	// Удалить профиль
	@UsePipes(new ValidationPipe())
	@Delete("profile")
	@Auth()
	deleteProfile(@CurrentUser("id") id: string) {
		return this.userService.deleteProfile(id)
	}
}
