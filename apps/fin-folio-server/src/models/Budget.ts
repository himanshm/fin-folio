import { getIsInvalidMessage } from "@/utils";
import { IsDate, IsUUID } from "class-validator";
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
import { User } from "./User";
import { ValidationEntity } from "./ValidationEntity";

@Entity("Budgets")
@Unique(["publicId"])
export class Budget extends ValidationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true, default: () => "gen_random_uuid()" })
  @IsUUID(4, { message: getIsInvalidMessage("Public ID") })
  publicId: string;

  @Column({ type: "date" })
  @IsDate({ message: getIsInvalidMessage("Month") })
  month: Date;

  @Column({ type: "int", default: 1, nullable: false })
  active: number;

  @Column({ type: "numeric", nullable: true })
  totalPlanned?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  version: number;

  @ManyToOne(() => User, user => user.budgets)
  user: User;

  @OneToMany(() => BudgetItem, item => item.budget)
  items: BudgetItem[];
}
