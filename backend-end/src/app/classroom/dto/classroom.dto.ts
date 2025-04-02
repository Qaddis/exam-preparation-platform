import { IsString, MaxLength, MinLength } from "class-validator"

export class ClassroomDto {
	@IsString()
	@MinLength(4, {
		message: "Classroom name must be at least 4 characters long"
	})
	@MaxLength(22, {
		message: "Classroom name must be no longer than 22 characters"
	})
	name: string
}
