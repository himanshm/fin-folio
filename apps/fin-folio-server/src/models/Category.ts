import {
  CategoryBucket,
  CategoryOrigin,
  CategoryType
} from "@/enums/CategoryType";
import { getIsInvalidMessage } from "@/utils";
import { IsEnum, IsNumber, IsOptional, Length } from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import { BudgetItem } from "./BudgetItem";
import { Investment } from "./Investment";
import { Transaction } from "./Transaction";
import { User } from "./User";
import { ValidationEntity } from "./ValidationEntity";
@Entity("Categories")
@Unique(["publicId"])
export class Category extends ValidationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true, default: () => "gen_random_uuid()" })
  publicId: string;

  @Column({ type: "enum", enum: CategoryType })
  @IsEnum(CategoryType, { message: getIsInvalidMessage("Category Type") })
  type: CategoryType;

  @Column({ type: "enum", enum: CategoryBucket, default: CategoryBucket.NEEDS })
  @IsEnum(CategoryBucket, { message: getIsInvalidMessage("Category Bucket") })
  bucket: CategoryBucket;

  @Column({ type: "varchar" })
  @Length(1, 50, { message: getIsInvalidMessage("Title") })
  title: string;

  @Column("numeric", { nullable: true })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  accumulatedAmount: number;

  @Column({ type: "enum", enum: CategoryOrigin, default: CategoryOrigin.USER })
  @IsEnum(CategoryOrigin, { message: getIsInvalidMessage("Category Origin") })
  origin: CategoryOrigin;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  version: number;

  @ManyToOne(() => User, user => user.categories)
  user: User;

  @OneToMany(() => BudgetItem, budgetItem => budgetItem.category)
  budgetItems: BudgetItem[];

  @OneToMany(() => Investment, investment => investment.category)
  investments: Investment[];

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions: Transaction[];
}
