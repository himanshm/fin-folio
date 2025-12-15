import { getIsInvalidMessage } from "@/utils";
import { IsDate, IsNotEmpty, IsString } from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import { User } from "./User";

@Entity("PasswordResetTokens")
export class PasswordResetToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  @IsNotEmpty({ message: getIsInvalidMessage("Token Hash") })
  @IsString({ message: getIsInvalidMessage("Token Hash") })
  tokenHash: string;

  @Column({ type: "timestamp" })
  @IsDate({ message: getIsInvalidMessage("Expires At") })
  expiresAt: Date;

  @Column({ type: "timestamp", nullable: true })
  @IsDate({ message: getIsInvalidMessage("Used At") })
  usedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  version: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;
}
