import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe
} from "@nestjs/common"
import { Auth } from "src/app/auth/decorators/auth.decorator"
import { Roles } from "src/app/user/decorators/role.decorator"
import { CurrentUser } from "src/app/user/decorators/user.decorator"
import { RoleGuard } from "src/app/user/guards/role.guard"
import { ClassroomService } from "./classroom.service"
import { ClassroomDto } from "./dto/classroom.dto"
import { ClassroomCodeDto } from "./dto/classroomCode.dto"
import { ClassroomIdDto } from "./dto/classroomId.dto"

@Controller("classrooms")
@UseGuards(RoleGuard)
@Auth()
export class ClassroomController {
	constructor(private readonly classroomService: ClassroomService) {}

	// Получение информации о классе по id
	@Get("/:classroomId")
	getClassroom(
		@CurrentUser("id") userId: string,
		@Param("classroomId") classroomId: string
	) {
		return this.classroomService.getById(userId, classroomId)
	}

	// Присоединиться к классу (ученик)
	@UsePipes(new ValidationPipe())
	@Patch("connect")
	@Roles("STUDENT")
	connectToClassroom(
		@CurrentUser("id") studentId: string,
		@Body() dto: ClassroomCodeDto
	) {
		return this.classroomService.connectToClassroom(studentId, dto)
	}

	// Выйти из класса (ученик)
	@UsePipes(new ValidationPipe())
	@Patch("disconnect")
	@Roles("STUDENT")
	disconnectFromClassroom(
		@CurrentUser("id") studentId: string,
		@Body() dto: ClassroomIdDto
	) {
		return this.classroomService.disconnectFromClassroom(studentId, dto)
	}

	// Создать класс (учитель)
	@UsePipes(new ValidationPipe())
	@Post("create")
	@Roles("TEACHER")
	createClassroom(
		@CurrentUser("id") teacherId: string,
		@Body() dto: ClassroomDto
	) {
		return this.classroomService.createClassroom(teacherId, dto)
	}

	// Удалить класс (учитель)
	@UsePipes(new ValidationPipe())
	@Delete("delete")
	@Roles("TEACHER")
	deleteClassroom(
		@CurrentUser("id") teacherId: string,
		@Body() dto: ClassroomIdDto
	) {
		return this.classroomService.deleteClassroom(teacherId, dto)
	}
}
