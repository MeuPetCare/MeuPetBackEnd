import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('🔍 Validating user:', email);

    const user = await this.userService.findByEmail(email);
    console.log('👤 User found:', user ? 'YES' : 'NO');

    if (!user) {
      console.log('❌ User not found');
      return null;
    }

    console.log('🔐 Comparing passwords...');
    console.log('🔑 Password from request:', password);
    console.log('🔒 Hash from database:', user.passwordHash);

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    console.log('✅ Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      crmv: user.crmv,
      specialty: user.specialty,
      roles: user.roles,
      isActive: user.isActive,
    };
  }

  login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
