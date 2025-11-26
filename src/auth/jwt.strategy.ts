import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  validate(payload: any) {
    console.log('🎫 JWT Payload recebido:', payload);

    const user = {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };

    console.log('👤 User retornado do validate:', user);
    return user;
  }
}
