import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cash_backs', { schema: 'rico_database_betkubkingtest' })
export class CashBacks {
  constructor(partial?: Partial<CashBacks | CashBacks[]>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
  @Expose() // npm i --save class-validator class-transformer
  @Index()
  id: string;

  @Column('timestamp', { name: 'created_at', nullable: true })
  createdAt: Date | null;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column('tinyint', {
    name: 'status',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  @Expose()
  status: boolean | null | number;

  @Column('int', {
    name: 'rate',
    nullable: true,
    unsigned: true,
    default: () => "'0'",
  })
  @Expose()
  rate: number | null;

  @Column('double', {
    name: 'max_amount',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'0.00'",
  })
  @Expose()
  maxAmount: number | null;

  @Column('varchar', {
    name: 'collect_type',
    nullable: true,
    length: 191,
    default: () => "'DAY'",
  })
  @Expose()
  collectType: string | null;

  @Column('int', {
    name: 'wdlimit_multiply',
    nullable: true,
    unsigned: true,
    default: () => "'5'",
  })
  @Expose()
  wdlimitMultiply: number | null;

  @Column('varchar', { name: 'pictureUrl', nullable: true, length: 191 })
  pictureUrl: string | null;

  @Column('double', {
    name: 'game',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'2.00'",
  })
  @Expose()
  game: number | null;

  @Column('double', {
    name: 'football',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'2.00'",
  })
  @Expose()
  football: number | null;

  @Column('double', {
    name: 'step',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'2.00'",
  })
  @Expose()
  step: number | null;

  @Column('double', {
    name: 'parlay',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'2.00'",
  })
  @Expose()
  parlay: number | null;

  @Column('double', {
    name: 'casino',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'2.00'",
  })
  @Expose()
  casino: number | null;

  @Column('double', {
    name: 'lotto',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'2.00'",
  })
  @Expose()
  lotto: number | null;

  @Column('double', {
    name: 'm2',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'2.00'",
  })
  @Expose()
  m2: number | null;

  @Column('double', {
    name: 'multi_player',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'2.00'",
  })
  @Expose()
  multiPlayer: number | null;

  @Column('double', {
    name: 'esport',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'2.00'",
  })
  @Expose()
  esport: number | null;

  @Column('varchar', {
    name: 'update_by',
    nullable: true,
    length: 191,
    default: () => "'RICO'",
  })
  @Expose()
  updateBy: string | null;

  @Column({
    nullable: true,
    default: () => false,
  })
  @Expose()
  cashback_type: boolean | null;
}
