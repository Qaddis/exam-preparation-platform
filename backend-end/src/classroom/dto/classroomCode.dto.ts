import { IsString } from "class-validator"

export class ClassroomCodeDto {
	@IsString()
	classroomCode: string
}
