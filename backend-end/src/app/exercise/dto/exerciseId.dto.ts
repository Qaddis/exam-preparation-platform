import { IsString } from "class-validator"

export class ExerciseIdDto {
	@IsString()
	exerciseId: string
}
