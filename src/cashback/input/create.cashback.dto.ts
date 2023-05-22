import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCashback {
  @IsNotEmpty()
  @ApiProperty({ example: true })
  status: boolean | number;

  @IsNotEmpty()
  @ApiProperty({ example: 5 })
  rate: number;

  @IsNotEmpty()
  @ApiProperty({ example: 5 })
  maxAmount: number;

  @IsNotEmpty()
  @ApiProperty({ example: 'DAY' })
  collectType: string;

  @IsNotEmpty()
  @ApiProperty({ example: 5 })
  wdlimitMultiply: number;

  pictureUrl: any | null;

  @IsNotEmpty()
  @ApiProperty({ example: 5 })
  game: number;

  @IsNotEmpty()
  @ApiProperty({ example: 5 })
  football: number;

  @IsNotEmpty()
  @ApiProperty({ example: 5 })
  step: number;

  @IsNotEmpty()
  @ApiProperty({ example: 5 })
  parlay: number;

  @IsNotEmpty()
  @ApiProperty({ example: 5 })
  casino: number;

  @IsNotEmpty()
  @ApiProperty({ example: 5 })
  lotto: number;

  @IsNotEmpty()
  @ApiProperty({ example: 5 })
  m2: number;

  @IsNotEmpty()
  @ApiProperty({ example: 5 })
  multiPlayer: number;

  @IsNotEmpty()
  @ApiProperty({ example: 5 })
  esport: number;
}
