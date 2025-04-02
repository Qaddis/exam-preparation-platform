import {
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from "@nestjs/common"
import { Exercise, User } from "@prisma/client"
import { PrismaService } from "src/app/prisma.service"
import { CompleteExerciseDto } from "./dto/completeExercise.dto"
import { CreateExerciseDto } from "./dto/createExercise.dto"
import { ExerciseIdDto } from "./dto/exerciseId.dto"

@Injectable()
export class ExerciseService {
	constructor(private prisma: PrismaService) {}

	// Получить задачу по ID
	private async byId(id: string) {
		const user = await this.prisma.exercise.findUnique({
			where: { id },
			include: {
				classroom: {
					include: {
						students: {
							select: {
								id: true,
								name: true
							}
						},
						teacher: {
							select: {
								id: true,
								name: true
							}
						}
					}
				},
				decided: {
					select: {
						id: true
					}
				}
			}
		})

		if (!user) throw new NotFoundException("Exercise not found")

		return user
	}

	// Получить информацию о задаче по ID
	async getExercise(user: User, exerciseId: string) {
		const exercise = await this.byId(exerciseId)

		const isUserStudent = exercise.classroom.students.some(
			({ id }) => id === user.id
		)

		if (user.role === "STUDENT" && isUserStudent)
			return {
				id: exercise.id,
				problem: exercise.problem,
				state: exercise.decided.some(({ id }) => id === user.id),
				available: exercise.available,
				asked: exercise.createdAt,
				classroom: {
					id: exercise.classroom.id,
					name: exercise.classroom.name
				},
				teacher: exercise.classroom.teacher
			}

		const isUserTeacher = exercise.classroom.teacherId === user.id

		if (user.role === "TEACHER" && isUserTeacher)
			return {
				id: exercise.id,
				problem: exercise.problem,
				answer: exercise.answer,
				available: exercise.available,
				asked: exercise.createdAt,
				classroom: {
					id: exercise.classroom.id,
					name: exercise.classroom.name
				},
				completed: exercise.classroom.students.filter(student =>
					exercise.decided.some(({ id }) => student.id === id)
				),
				uncompleted: exercise.classroom.students.filter(
					student => !exercise.decided.some(({ id }) => student.id === id)
				)
			}

		throw new ForbiddenException("No access")
	}

	// Получить список задач из определённого класса
	async getExercisesFromClassroom(userId: string, classroomId: string) {
		const classroom = await this.prisma.classroom.findUnique({
			where: { id: classroomId },
			include: { exercises: true, students: true }
		})

		if (
			classroom.teacherId !== userId &&
			!classroom.students.some(student => student.id !== userId)
		)
			throw new ForbiddenException("No access")

		return classroom.exercises
	}

	// Получить все невыполненные задачи (ученик)
	async getUncompletedExercises(studentId: string) {
		const student = await this.prisma.user.findUnique({
			where: {
				id: studentId
			},
			include: {
				solved: true,
				classrooms: {
					include: {
						exercises: true
					}
				}
			}
		})

		if (!student)
			throw new NotFoundException("Student with this id was not found")

		const uncompletedExercises: Exercise[] = student.classrooms.flatMap(
			({ exercises }) =>
				exercises.filter(
					exercise => !student.solved.some(solved => solved.id === exercise.id)
				)
		)

		return uncompletedExercises
	}

	// Отправить ответ на задачу (ученик)
	async completeExercise(studentId: string, dto: CompleteExerciseDto) {
		const exercise = await this.byId(dto.exerciseId)

		if (!exercise.classroom.students.some(student => student.id === studentId))
			throw new ForbiddenException("No access")

		if (exercise.answer !== dto.userAnswer) return "Incorrect"

		try {
			await this.prisma.exercise.update({
				where: { id: exercise.id },
				data: {
					decided: {
						connect: { id: studentId }
					}
				}
			})

			return "Correct"
		} catch {
			throw new InternalServerErrorException(
				"Unexpected error. Please try again later"
			)
		}
	}

	// Создать задачу (учитель)
	async createExercise(teacherId: string, dto: CreateExerciseDto) {
		const classroom = await this.prisma.classroom.findUnique({
			where: { id: dto.classroomId }
		})

		if (classroom.teacherId !== teacherId)
			throw new ForbiddenException("No access")

		try {
			await this.prisma.exercise.create({
				data: {
					problem: dto.problem,
					answer: dto.answer,
					available: dto.available ? dto.available : "",
					classroomId: classroom.id
				}
			})

			return "ok"
		} catch {
			throw new InternalServerErrorException(
				"Unexpected error. Please try again later"
			)
		}
	}

	// Удалить задачу (учитель)
	async deleteExercise(teacherId: string, dto: ExerciseIdDto) {
		const exercise = await this.byId(dto.exerciseId)

		if (exercise.classroom.teacherId !== teacherId)
			throw new ForbiddenException("No access")

		try {
			await this.prisma.exercise.delete({
				where: { id: dto.exerciseId }
			})

			return "ok"
		} catch {
			throw new InternalServerErrorException(
				"Unexpected error. Please try again later"
			)
		}
	}
}
