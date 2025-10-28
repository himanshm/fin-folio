import { getIsInvalidMessage } from '@/utils';
import { IsDate } from 'class-validator';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';
import { BudgetItem } from './BudgetItem';
import { User } from './User';
import { ValidationEntity } from './ValidationEntity';

@Entity('Budgets')
@Unique(['publicId'])
export class Budget extends ValidationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn('uuid')
  publicId: string;

  @Column({ type: 'date' })
  @IsDate({ message: getIsInvalidMessage('Month') })
  month: Date;

  @Column({ type: 'numeric', nullable: true })
  totalPlanned?: number;

  @ManyToOne(() => User, user => user.budgets)
  user: User;

  @OneToMany(() => BudgetItem, item => item.budget)
  items: BudgetItem[];
}
