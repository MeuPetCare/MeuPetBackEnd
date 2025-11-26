import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log('🔐 Required roles:', requiredRoles);

    if (!requiredRoles) {
      console.log('✅ No roles required, access granted');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('👤 User from request:', user);
    console.log('👥 User roles:', user?.roles);

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    console.log('✅ Has required role?', hasRole);

    return hasRole;
  }
}
