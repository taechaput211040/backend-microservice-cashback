import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cashback_recieved_records', { schema: 'rico_database_betkubkingtest' })
export class CashbackRecievedRecords {
  constructor(
    partial?: Partial<CashbackRecievedRecords | CashbackRecievedRecords[]>,
  ) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
  @Expose()
  @Index()
  id: string;

  @Column('timestamp', { name: 'created_at', nullable: true })
  createdAt: Date | null;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column('varchar', { name: 'username', length: 191 })
  @Expose()
  username: string;

  @Column('double', {
    name: 'cb_recieve',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'0.00'",
  })
  @Expose()
  cbRecieve: number | null;
}
