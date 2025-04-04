import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { ClassroomModule } from "./classroom/classroom.module"
import { ExerciseModule } from "./exercise/exercise.module"
import { PrismaService } from "./prisma.service"
import { UserModule } from "./user/user.module"

@Module({
	imports: [
		ConfigModule.forRoot(),
		AuthModule,
		UserModule,
		ClassroomModule,
		ExerciseModule
	],
	providers: [PrismaService]
})
export class AppModule {}
