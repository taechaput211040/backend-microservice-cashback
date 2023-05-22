import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cashback_records', { schema: 'rico_database_betkubkingtest' })
export class CashbackRecords {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
  @Index()
  @Expose()
  id: string;

  @Column('timestamp', { name: 'created_at', nullable: true })
  @Expose()
  createdAt: Date | null;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  @Expose()
  updatedAt: Date | null;

  @Column('varchar', { name: 'username', length: 191 })
  @Expose()
  username: string;

  @Column('double', {
    name: 'dp_amount',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'0.00'",
  })
  @Expose()
  dpAmount: number | null;

  @Column('double', {
    name: 'cb_amount',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'0.00'",
  })
  @Expose()
  cbAmount: number | null;

  @Column('tinyint', {
    name: 'cb_valid',
    nullable: true,
    width: 1,
    default: () => "'0'",
  })
  @Expose()
  cbValid: boolean | null;
}
