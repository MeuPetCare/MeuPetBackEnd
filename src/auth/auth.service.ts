import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    if (username === 'admin' && pass === 'admin') {
      return { userId: 1, username: 'admin', roles: ['admin'] };
    }
    if (username === 'vet' && pass === 'vet') {
      return { userId: 2, username: 'vet', roles: ['veterinarian'] };
    }
    await Promise.resolve();
    return null;
  }

  login(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
