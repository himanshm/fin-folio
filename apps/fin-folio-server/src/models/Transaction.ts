import { getIsInvalidMessage } from '@/utils';
import { IsDate, IsDecimal, IsOptional } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoryBudget } from './CategoryBudget';
import { User } from './User';
import { ValidationEntity } from './ValidationEntity';

@Entity('Transactions')
export class Transaction extends ValidationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  title: string;

  @Column({ type: 'double precision' })
  @IsDecimal(
    { decimal_digits: '2' },
    { message: getIsInvalidMessage('Amount') }
  )
  amount: number;

  @Column({ type: 'date' })
  @IsDate({ message: getIsInvalidMessage('Date') })
  date: Date;

  @ManyToOne(
    () => CategoryBudget,
    categoryBudget => categoryBudget.transactions
  )
  categoryBudget: CategoryBudget;

  @ManyToOne(() => User, user => user.transactions)
  user: User;
}
