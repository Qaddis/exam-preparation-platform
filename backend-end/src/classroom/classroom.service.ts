import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException
} from "@nestjs/common"
import { PrismaService } from "src/prisma.service"
import { ClassroomDto } from "./dto/classroom.dto"
import { ClassroomCodeDto } from "./dto/classroomCode.dto"
import { ClassroomIdDto } from "./dto/classroomId.dto"

@Injectable()
export class ClassroomService {
	constructor(private prisma: PrismaService) {}

	// Получение класса по id
	private async byId(id: string) {
		const classroom = await this.prisma.classroom.findUnique({
			where: { id },
			include: { students: true }
		})

		if (!classroom) throw new NotFoundException("This classroom was not found")

		return classroom
	}

	// Генерация уникального кода класса
	private generateClassroomCode() {
		const characters: string = "0123456789ABCDEF"
		let result: string = ""

		for (let i = 0; i < 8; i++) {
			const randIndex = Math.floor(Math.random() * characters.length)

			result += characters[randIndex]
		}

		return result
	}

	// Присоединиться к классу (ученик)
	async connectToClassroom(studentId: string, dto: ClassroomCodeDto) {
		const classroom = await this.prisma.classroom.findUnique({
			where: { code: dto.classroomCode },
			include: { students: true }
		})

		if (!classroom) throw new NotFoundException("This classroom was not found")

		if (classroom.students.some(student => student.id === studentId))
			throw new BadRequestException("The user is already in this classroom")

		try {
			await this.prisma.classroom.update({
				where: { id: classroom.id },
				data: {
					students: {
						connect: { id: studentId }
					}
				}
			})

			return "ok"
		} catch {
			throw new InternalServerErrorException(
				"Unexpected error. Please try again later"
			)
		}
	}

	// Выйти из класса (ученик)
	async disconnectFromClassroom(studentId: string, dto: ClassroomIdDto) {
		const classroom = await this.byId(dto.classroomId)

		if (!classroom.students.some(student => student.id === studentId))
			throw new BadRequestException(
				"The user is not a member of this classroom"
			)

		try {
			await this.prisma.classroom.update({
				where: { id: classroom.id },
				data: {
					students: {
						disconnect: {
							id: studentId
						}
					}
				}
			})

			return "ok"
		} catch {
			throw new InternalServerErrorException(
				"Unexpected error. Please try again later"
			)
		}
	}

	// Создать класс (учитель)
	async createClassroom(teacherId: string, dto: ClassroomDto) {
		let code: string

		do code = this.generateClassroomCode()
		while (await this.prisma.classroom.findUnique({ where: { code } }))

		try {
			await this.prisma.classroom.create({
				data: {
					name: dto.name,
					teacherId,
					code
				}
			})

			return "ok"
		} catch {
			throw new InternalServerErrorException(
				"Unexpected error. Please try again later"
			)
		}
	}

	// Удалить класс (учитель)
	async deleteClassroom(teacherId: string, dto: ClassroomIdDto) {
		const classroom = await this.byId(dto.classroomId)

		if (classroom.teacherId !== teacherId)
			throw new ForbiddenException("No access")

		try {
			await this.prisma.classroom.delete({ where: { id: classroom.id } })

			return "ok"
		} catch {
			throw new InternalServerErrorException(
				"Unexpected error. Please try later"
			)
		}
	}
}
