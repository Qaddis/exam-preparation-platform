import { Role } from "@prisma/client"
import {
	IsEmail,
	IsEnum,
	IsString,
	MaxLength,
	MinLength
} from "class-validator"

export class RegisterDto {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(6, { message: "Password must be at least 6 characters long" })
	password: string

	@IsString()
	@MinLength(2, { message: "Name must be at least 2 characters long" })
	@MaxLength(22, { message: "Name must be no longer than 22 characters" })
	name: string

	@IsEnum(Role, { message: "Role must be either STUDENT or TEACHER" })
	role: Role
}
