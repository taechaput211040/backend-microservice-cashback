import { Body, Controller, Get, Logger, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { CashbackService } from './cashback.service';
import { UpdateCashback } from './input/update.cashback.dto';

@ApiTags('rico')
@Controller('cashback')
export class CashbackController {
  private readonly logger = new Logger();
  constructor(private readonly cashBackservice: CashbackService) {}
  @Get('/GetCashBackSetting')
  @UseGuards(JwtStrategy)
  getGetCashBack() {
    return this.cashBackservice.getCurrentCashback();
  }

  @Get('/Cashbackcheck/:username')
  async checkCashBack(@Param('username') username: string) {
    // return `hi ${username}`;
    return this.cashBackservice.checkCashback(username);
  }

  @Patch('/SaveCashBackSetting')
  @UseGuards(JwtStrategy)
  async saveCashBackSettimg(@Body() input: UpdateCashback) {
    return await this.cashBackservice.updateSetting(input);
  }

  @Patch('/ToggleCashback')
  @UseGuards(JwtStrategy)
  toggleCashback() {
    return this.cashBackservice.tougle();
  }

  @Patch('/toggleTypeCashback')
  @UseGuards(JwtStrategy)
  toggleType() {
    return this.cashBackservice.tougleType();
  }

  @Post('/collectCashback/:username')
  async collectCashBack(@Param('username') username: string) {
    return await this.cashBackservice.collectCashback(username);
  }
}
