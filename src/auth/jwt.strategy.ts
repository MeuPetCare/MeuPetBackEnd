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

    // Check if it's a service token
    if (payload.type === 'service') {
      const service = {
        type: 'service',
        serviceName: payload.serviceName,
        scopes: payload.scopes || [],
        description: payload.description,
        issuedAt: payload.iat,
      };
      console.log('🔧 Service token validated:', service);
      return service;
    }

    // Regular user token
    const user = {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };

    console.log('👤 User retornado do validate:', user);
    return user;
  }
}
