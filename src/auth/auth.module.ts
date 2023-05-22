import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { CashbackRecievedRecords } from 'src/cashback/entity/CashbackRecievedRecords';
import { CashbackMembers } from 'src/cashback/entity/CashbackMembers';
import { CashBacks } from 'src/cashback/entity/CashBacks';
import { CashbackRecords } from 'src/cashback/entity/CashbackRecords';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CashBacks,
      CashbackMembers,
      CashbackRecievedRecords,
      CashbackRecords,
    ]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.AUTH_SECRET,
        signOptions: {
          expiresIn: '60m',
        },
      }),
    }),
    
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
