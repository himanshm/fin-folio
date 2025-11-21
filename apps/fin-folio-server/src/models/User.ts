import bcrypt from "bcrypt";
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import { ValidationEntity } from "./ValidationEntity";

import {
  EMAIL_VALIDATION_MESSAGE,
  EMAIL_VALIDATION_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
  PASSWORD_VALIDATION_REGEX,
  getIsInvalidMessage
} from "@/utils";
import { IsEmail, IsOptional, IsUUID, Length, Matches } from "class-validator";
import { Budget } from "./Budget";
import { Category } from "./Category";
import { Investment } from "./Investment";
import { Transaction } from "./Transaction";
import { UserSession } from "./UserSession";

@Entity("Users")
@Unique(["email", "publicId"])
export class User extends ValidationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true, default: () => "gen_random_uuid()" })
  @IsOptional()
  @IsUUID(4, { message: getIsInvalidMessage("Public ID") })
  publicId: string;

  @Column({ type: "varchar", nullable: false })
  @Length(1, 100, { message: getIsInvalidMessage("Name") })
  name: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  @IsEmail(undefined, { message: getIsInvalidMessage("Email") })
  @Matches(EMAIL_VALIDATION_REGEX, {
    message: `${getIsInvalidMessage("Email")}. ${EMAIL_VALIDATION_MESSAGE}`
  })
  email: string;

  @Column({ type: "varchar", nullable: true })
  @Matches(PASSWORD_VALIDATION_REGEX, {
    message: `${getIsInvalidMessage("Password")}. ${PASSWORD_VALIDATION_MESSAGE}`
  })
  password: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  avatarUrl: string;

  @Column({ nullable: true, type: "varchar" })
  @IsOptional()
  country: string;

  @Column({ type: "varchar", nullable: true, default: "USD" })
  @Length(3, 3, {
    message: `${getIsInvalidMessage("Currency")}. Must be 3 characters long currency code.`
  })
  @IsOptional()
  currency: string;

  @Column({ type: "varchar", nullable: true, default: "$" })
  @IsOptional()
  currencySymbol: string;

  @Column({ type: "varchar", nullable: true, default: "en-US" })
  @IsOptional()
  locale: string;

  @Column({ type: "int", default: 0 })
  refreshTokenVersion: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  version: number;

  @OneToMany(() => Category, category => category.user)
  categories: Category[];

  @OneToMany(() => Budget, budget => budget.user)
  budgets: Budget[];

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Investment, investment => investment.user)
  investments: Investment[];

  @OneToMany(() => UserSession, session => session.user)
  sessions: UserSession[];

  // This property stores a cached password used to check
  // if the password was changed during an update
  cachedPassword: string;

  @AfterLoad()
  cachePassword() {
    if (this.password) {
      this.cachedPassword = this.password;
    }
  }

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() {
    if (!this.password) return;
    if (this.cachedPassword === this.password) return;
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async isPasswordValid(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
