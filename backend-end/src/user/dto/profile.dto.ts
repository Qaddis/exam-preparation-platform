import {
	IsEmail,
	IsOptional,
	IsString,
	MaxLength,
	MinLength
} from "class-validator"

export class ProfileDto {
	@IsEmail()
	email: string

	@IsOptional()
	@IsString()
	@MinLength(6, { message: "Password must be at least 6 characters long" })
	password?: string

	@IsOptional()
	@IsString()
	@MinLength(2, { message: "Name must be at least 2 characters long" })
	@MaxLength(22, { message: "Name must be no longer than 22 characters" })
	name?: string
}
