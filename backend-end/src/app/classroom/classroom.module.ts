import { Module } from "@nestjs/common"
import { PrismaService } from "src/app/prisma.service"
import { ClassroomController } from "./classroom.controller"
import { ClassroomService } from "./classroom.service"

@Module({
	controllers: [ClassroomController],
	providers: [ClassroomService, PrismaService]
})
export class ClassroomModule {}
