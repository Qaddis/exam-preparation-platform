import { IsString } from "class-validator"

export class CompleteExerciseDto {
	@IsString()
	exerciseId: string

	@IsString()
	userAnswer: string
}
