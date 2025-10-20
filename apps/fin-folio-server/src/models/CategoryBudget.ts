import { getIsInvalidMessage } from '@/utils';
import { IsDecimal } from 'class-validator';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Budget } from './Budget';
import { Category } from './Category';
import { Transaction } from './Transaction';
import { ValidationEntity } from './ValidationEntity';

@Entity('CategoryBudgets')
export class CategoryBudget extends ValidationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double precision' })
  @IsDecimal(
    { decimal_digits: '2' },
    { message: getIsInvalidMessage('Amount') }
  )
  amount: number;

  @ManyToOne(() => Category, category => category.categoryBudgets)
  category: Category;

  @ManyToOne(() => Budget, budget => budget.categoryBudgets)
  budget: Budget;

  @OneToMany(() => Transaction, transaction => transaction.categoryBudget)
  transactions: Transaction[];
}
