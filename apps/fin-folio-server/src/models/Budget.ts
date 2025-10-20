import { getIsInvalidMessage } from '@/utils';
import { IsDate } from 'class-validator';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { CategoryBudget } from './CategoryBudget';
import { User } from './User';
import { ValidationEntity } from './ValidationEntity';

@Entity('Budgets')
export class Budget extends ValidationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  @IsDate({ message: getIsInvalidMessage('Month') })
  month: Date;

  @OneToMany(() => CategoryBudget, categoryBudget => categoryBudget.budget)
  categoryBudgets: CategoryBudget[];

  @ManyToOne(() => User, user => user.budgets)
  user: User;
}
