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
import { CurrentUser } from "src/user/decorators/user.decorator"
import { ProfileDto } from "./dto/profile.dto"
import { UserService } from "./user.service"

@Controller("users")
@Auth()
export class UserController {
	constructor(private readonly userService: UserService) {}

	// Получить профиль
	@Get("profile")
	getProfile(@CurrentUser("id") id: string) {
		return this.userService.getProfile(id)
	}

	// Изменить профиль
	@UsePipes(new ValidationPipe())
	@Put("profile")
	updateProfile(@CurrentUser("id") id: string, @Body() dto: ProfileDto) {
		return this.userService.updateProfile(id, dto)
	}

	// Удалить профиль
	@UsePipes(new ValidationPipe())
	@Delete("profile")
	deleteProfile(@CurrentUser("id") id: string) {
		return this.userService.deleteProfile(id)
	}
}
