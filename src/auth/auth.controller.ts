import {
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardJwt } from './auth-guard.jwt';
import { AuthService } from './auth.service';

@Controller('/api/Setting/Login/key')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Request() request) {
    this.logger.log(request.headers.key);
    if (request.headers.key == process.env.SUPERADMIN_KEY) {
      return {
        userId: request.headers.key,
        token: this.authService.getTokenForUser(request.headers.key),
      };
    } else {
      throw new UnauthorizedException();
    }
  }
  @Get('role')
  @UseGuards(AuthGuardJwt)
  async getRole(@Request() request) {
    return request.headers;
  }
}
