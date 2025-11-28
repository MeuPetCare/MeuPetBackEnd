import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { ForcePasswordChangeDto } from './dto/force-password-change.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.userService.findByEmail(email);

    if (!user || !user.passwordHash) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user as any;
    return safeUser;
  }

  login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };
    
    // Remove passwordHash if it exists (extra safety)
    const { passwordHash, ...userData } = user;
    
    return {
      access_token: this.jwtService.sign(payload),
      user: userData,
    };
  }

  async getCurrentUser(userId: number): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userService.findOneById(userId);
    
    // Remove passwordHash for safety (though it should already be excluded)
    const { passwordHash, ...userData } = user as any;
    return userData;
  }

  createServiceToken(
    serviceName: string,
    scopes: string[] = [],
    expiresIn: number = 86400, // 1 day default
    description?: string,
  ) {
    const payload = {
      serviceName,
      type: 'service',
      scopes,
      description,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: `${expiresIn}s`,
    });

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: expiresIn,
      service_name: serviceName,
      scopes,
      description,
    };
  }

  async forcePasswordChange(
    userId: number,
    dto: ForcePasswordChangeDto,
  ): Promise<{ message: string; user: Omit<User, 'passwordHash'> }> {
    const user = await this.userService.findByEmail(
      (await this.userService.findOneById(userId)).email,
    );

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verifica se a senha atual está correta
    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Senha atual incorreta');
    }

    // Gera hash da nova senha
    const newPasswordHash = await bcrypt.hash(dto.newPassword, 10);

    // Atualiza a senha e remove a flag de alteração obrigatória
    await this.userService.update(userId, {
      passwordHash: newPasswordHash,
      mustChangePassword: false,
    });

    // Retorna dados do usuário atualizados
    const updatedUser = await this.getCurrentUser(userId);

    return {
      message: 'Senha alterada com sucesso',
      user: updatedUser,
    };
  }
}
