import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Role } from "@prisma/client"

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
			context.getHandler(),
			context.getClass()
		])

		if (!requiredRoles) return true

		const request = context.switchToHttp().getRequest()
		const user = request.user

		if (!user) throw new UnauthorizedException("User is not authorized")

		if (!requiredRoles.includes(user.role))
			throw new ForbiddenException("No access")

		return true
	}
}
