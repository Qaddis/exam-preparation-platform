import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe
} from "@nestjs/common"
import { User } from "@prisma/client"
import { Auth } from "src/auth/decorators/auth.decorator"
import { Roles } from "src/user/decorators/role.decorator"
import { CurrentUser } from "src/user/decorators/user.decorator"
import { RoleGuard } from "src/user/guards/role.guard"
import { CompleteExerciseDto } from "./dto/completeExercise.dto"
import { CreateExerciseDto } from "./dto/createExercise.dto"
import { ExerciseIdDto } from "./dto/exerciseId.dto"
import { ExerciseService } from "./exercise.service"

@Controller("exercises")
@UseGuards(RoleGuard)
@Auth()
export class ExerciseController {
	constructor(private readonly exerciseService: ExerciseService) {}

	@Get("/:exerciseId")
	getExercise(
		@CurrentUser() user: User,
		@Param("exerciseId") exerciseId: string
	) {
		return this.exerciseService.getExercise(user, exerciseId)
	}

	// Получить список задач из определённого класса
	@Get("from/:classroomId")
	getExercisesFromClassroom(
		@CurrentUser("id") userId: string,
		@Param("classroomId") classroomId: string
	) {
		return this.exerciseService.getExercisesFromClassroom(userId, classroomId)
	}

	// Получить все невыполненные задачи (ученик)
	@Get("uncompleted")
	@Roles("STUDENT")
	getUncompletedExercises(@CurrentUser("id") studentId: string) {
		return this.exerciseService.getUncompletedExercises(studentId)
	}

	// Отправить ответ на задачу (ученик)
	@UsePipes(new ValidationPipe())
	@Post("complete")
	@Roles("STUDENT")
	completeExercise(
		@CurrentUser("id") studentId: string,
		@Body() dto: CompleteExerciseDto
	) {
		return this.exerciseService.completeExercise(studentId, dto)
	}

	// Создать задачу (учитель)
	@UsePipes(new ValidationPipe())
	@Post("new")
	@Roles("TEACHER")
	createExercise(
		@CurrentUser("id") teacherId: string,
		@Body() dto: CreateExerciseDto
	) {
		return this.exerciseService.createExercise(teacherId, dto)
	}

	// Удалить задачу (учитель)
	@UsePipes(new ValidationPipe())
	@Delete("delete")
	@Roles("TEACHER")
	deleteExercise(
		@CurrentUser("id") teacherId: string,
		@Body() dto: ExerciseIdDto
	) {
		return this.exerciseService.deleteExercise(teacherId, dto)
	}
}
