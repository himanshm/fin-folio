import { getIsInvalidMessage } from "@/utils";
import bcrypt from "bcrypt";
import {
  IsBoolean,
  IsDate,
  IsIP,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length
} from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn
} from "typeorm";
import { User } from "./User";
import { ValidationEntity } from "./ValidationEntity";

@Entity("UserSessions")
export class UserSession extends ValidationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  @IsNotEmpty({ message: getIsInvalidMessage("Token Hash") })
  @IsString({ message: getIsInvalidMessage("Token Hash") })
  tokenHash: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @Length(0, 255, { message: "Device Info must be 255 characters or less" })
  deviceInfo?: string;

  @Column({ type: "varchar", nullable: true })
  @IsOptional()
  @IsIP(undefined, { message: "IP Address must be a valid IP address" })
  ipAddress?: string;

  @Column({ type: "boolean", default: false })
  @IsOptional()
  @IsBoolean({ message: getIsInvalidMessage("Revoked") })
  revoked: boolean;

  @Column({ type: "timestamp", nullable: true })
  @IsOptional()
  @IsDate({ message: getIsInvalidMessage("Expires At") })
  expiresAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  @IsOptional()
  @IsDate({ message: getIsInvalidMessage("Last Used At") })
  lastUsedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @VersionColumn()
  version: number;

  @ManyToOne(() => User, user => user.sessions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User;

  async isTokenValid(token: string): Promise<boolean> {
    return await bcrypt.compare(token, this.tokenHash);
  }
}
