import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cashback_members', { schema: 'rico_database_betkubkingtest' })
export class CashbackMembers {
  constructor(partial?: Partial<CashbackMembers | CashbackMembers[]>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id', unsigned: true })
  @Index()
  @Expose()
  id: string;

  @Column('timestamp', { name: 'created_at', nullable: true })
  createdAt: Date | null;

  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date | null;

  @Column('varchar', { name: 'username', length: 191 })
  @Expose()
  username: string;

  @Column('double', {
    name: 'cb_collectable',
    nullable: true,
    unsigned: true,
    precision: 8,
    scale: 2,
    default: () => "'0.00'",
  })
  @Expose()
  cbCollectable: number | null;

  @Column('datetime', {
    name: 'start_cal_time',
    nullable: true,
    default: () => "'2021-02-17 14:20:17'",
  })
  @Expose()
  startCalTime: Date | null;

  @Column('datetime', {
    name: 'last_cal_time',
    nullable: true,
    default: () => "'2021-02-17 14:20:17'",
  })
  @Expose()
  lastCalTime: Date | null;

  @Column('datetime', {
    name: 'last_collect_time',
    nullable: true,
    default: () => "'2021-02-17 14:20:17'",
  })
  @Expose()
  lastCollectTime: Date | null;

  @Column('bigint', {
    name: 'collect_count',
    nullable: true,
    unsigned: true,
    default: () => "'0'",
  })
  @Expose()
  collectCount: string | null;
}
