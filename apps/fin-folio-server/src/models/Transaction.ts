import { TransactionType } from '@/enums/TransactionType';
import { getIsInvalidMessage } from '@/utils';
import { IsDate, IsDecimal, IsEnum, IsOptional } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BudgetItem } from './BudgetItem';
import { Category } from './Category';
import { User } from './User';
import { ValidationEntity } from './ValidationEntity';

@Entity('Transactions')
@Unique(['publicId'])
export class Transaction extends ValidationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn('uuid')
  publicId: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  title: string;

  @Column({ type: 'double precision' })
  @IsDecimal(
    { decimal_digits: '2' },
    { message: getIsInvalidMessage('Amount') }
  )
  amount: number;

  @Column({ type: 'enum', enum: TransactionType })
  @IsEnum(TransactionType, { message: getIsInvalidMessage('Transaction Type') })
  type: TransactionType;

  @Column({ type: 'date' })
  @IsDate({ message: getIsInvalidMessage('Date') })
  date: Date;

  @ManyToOne(() => Category, category => category.transactions)
  category: Category;

  @ManyToOne(() => BudgetItem, budgetItem => budgetItem.transactions, { nullable: true })
  budgetItem?: BudgetItem;

  // If budgetItem is provided → derive category from it automatically.
  // If not → use the transaction’s own category.

  @ManyToOne(() => User, user => user.transactions)
  user: User;
}
