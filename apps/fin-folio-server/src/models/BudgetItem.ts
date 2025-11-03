import { getIsInvalidMessage } from "@/utils";
import { IsDecimal, IsOptional, IsUUID } from "class-validator";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { Budget } from "./Budget";
import { Category } from "./Category";
import { Transaction } from "./Transaction";
import { ValidationEntity } from "./ValidationEntity";

@Entity("BudgetItems")
@Unique(["publicId"])
export class BudgetItem extends ValidationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true, default: () => "gen_random_uuid()" })
  @IsUUID(4, { message: getIsInvalidMessage("Public ID") })
  publicId: string;

  @Column({ type: "double precision" })
  @IsDecimal(
    { decimal_digits: "2" },
    { message: getIsInvalidMessage("Amount") }
  )
  plannedAmount: number;

  @Column("double precision", { nullable: true })
  @IsDecimal(
    { decimal_digits: "2" },
    { message: getIsInvalidMessage("Actual Amount") }
  )
  @IsOptional()
  actualAmount: number;

  @ManyToOne(() => Budget, budget => budget.items)
  budget: Budget;

  @ManyToOne(() => Category, category => category.budgetItems)
  category: Category;

  @OneToMany(() => Transaction, transaction => transaction.budgetItem)
  transactions: Transaction[];
}
