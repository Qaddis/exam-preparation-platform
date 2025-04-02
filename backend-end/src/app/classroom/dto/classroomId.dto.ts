import { IsString } from "class-validator"

export class ClassroomIdDto {
	@IsString()
	classroomId: string
}
