import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CashbackController } from './cashback.controller';
import { CashbackService } from './cashback.service';
import { CashbackMembers } from './entity/CashbackMembers';
import { CashbackRecievedRecords } from './entity/CashbackRecievedRecords';
import { CashbackRecords } from './entity/CashbackRecords';
import { CashBacks } from './entity/CashBacks';
import { MemberService } from './member.service';
import { staticCashback } from './staticCashback.controller';

@Module({
  controllers: [CashbackController, staticCashback],
  providers: [CashbackService, MemberService],
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      CashbackMembers,
      CashbackRecievedRecords,
      CashbackRecords,
      CashBacks,
    ]),
  ],
})
export class CashbackModule {}
