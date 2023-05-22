import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CashbackMembers } from 'src/cashback/entity/CashbackMembers';
import { CashbackRecievedRecords } from 'src/cashback/entity/CashbackRecievedRecords';
import { CashbackRecords } from 'src/cashback/entity/CashbackRecords';
import { CashBacks } from 'src/cashback/entity/CashBacks';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      CashbackMembers,
      CashbackRecievedRecords,
      CashbackRecords,
      CashBacks,
    ],
    synchronize: false,
    ssl: {
      rejectUnauthorized: false,
      // ca: atob(process.env.CROCK_DB_CERT),
    },
  }),
);
