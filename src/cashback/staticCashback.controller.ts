import {
  Controller,
  Get,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { CashbackService } from './cashback.service';

@Controller('/static')
@ApiTags('member')
export class staticCashback {
  constructor(private readonly cashBackservice: CashbackService) {}

  @Get('/Cashback/:hash/:username')
  getCashback(
    @Param('hash') hash: string,
    @Param('username') username: string,
  ) {
    if (hash != process.env.AUTH_SECRET) {
      throw new UnauthorizedException();
    }
    return this.cashBackservice.getCurrentCashback();
  }

  @Get('/CashbackCheck/:hash/:username')
  checkcashback(
    @Param('hash') hash: string,
    @Param('username') username: string,
  ) {
    if (hash != process.env.AUTH_SECRET) {
      throw new UnauthorizedException();
    }
    return this.cashBackservice.checkCashback(username);
  }

  @Get('/CachbackCollect/:hash/:username')
  async collectcashback(
    @Param('hash') hash: string,
    @Param('username') username: string,
  ) {
    if (hash != process.env.AUTH_SECRET) {
      throw new UnauthorizedException();
    }
    return await this.cashBackservice.collectCashback(username);
  }
}
