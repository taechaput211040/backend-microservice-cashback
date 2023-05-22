import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtservice: JwtService) {}
  public async getTokenForUser(key): Promise<string> {
    return this.jwtservice.sign({
      role: 'superadmin',
    });
  }
}
