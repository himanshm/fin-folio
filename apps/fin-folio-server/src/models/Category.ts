import { getIsInvalidMessage } from '@/utils';
import { IsDecimal, IsEnum, IsOptional, Length } from 'class-validator';
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

export enum CategoryType {
  INCOME = 0,
  EXPENSE = 1,
  SAVINGS = 2,
  DEBT = 3
}

@Entity('Categories')
export class Category extends ValidationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: CategoryType })
  @IsEnum(CategoryType, { message: getIsInvalidMessage('Type') })
  type: CategoryType;

  @Column({ type: 'varchar' })
  @Length(1, 50, { message: getIsInvalidMessage('Title') })
  title: string;

  @Column('double precision', { nullable: true })
  @IsDecimal(
    { decimal_digits: '2' },
    { message: getIsInvalidMessage('Accumulated Amount') }
  )
  @IsOptional()
  accAmount: number;

  @ManyToOne(() => User, user => user.categories)
  user: User;

  @OneToMany(() => CategoryBudget, categoryBudget => categoryBudget.category)
  categoryBudgets: CategoryBudget[];
}
