import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { SKIP_PASSWORD_CHECK_KEY } from './skip-password-check.decorator';

@Injectable()
export class PasswordChangeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verifica se a rota está marcada para pular a verificação de senha
    const skipPasswordCheck = this.reflector.getAllAndOverride<boolean>(
      SKIP_PASSWORD_CHECK_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipPasswordCheck) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      return true; // Se não há usuário, deixa outros guards lidarem
    }

    // Busca o usuário completo para verificar mustChangePassword
    const fullUser = await this.userService.findOneById(user.id);

    if (fullUser.mustChangePassword) {
      // Permite apenas acesso ao endpoint de alteração de senha
      const url = request.url;
      if (url !== '/auth/force-password-change') {
        throw new UnauthorizedException(
          'Você deve alterar sua senha antes de acessar o sistema. Use o endpoint /auth/force-password-change',
        );
      }
    }

    return true;
  }
}