import type { ConfigService } from "@nestjs/config"
import type { JwtModuleOptions } from "@nestjs/jwt"

export const getJwtConfig = async (
	configService: ConfigService
): Promise<JwtModuleOptions> => ({
	secret: configService.get("JWT_SECRET")
})
