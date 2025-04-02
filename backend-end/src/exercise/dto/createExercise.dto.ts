import { IsDateString, IsOptional, IsString } from "class-validator"

export class CreateExerciseDto {
	@IsString()
	classroomId: string

	@IsString()
	problem: string

	@IsString()
	answer: string

	@IsOptional()
	@IsDateString()
	available?: string
}
