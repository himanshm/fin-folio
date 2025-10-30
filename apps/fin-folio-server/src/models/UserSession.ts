import bcrypt from "bcrypt";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { ValidationEntity } from "./ValidationEntity";

@Entity("UserSessions")
export class UserSession extends ValidationEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "text" })
  tokenHash: string;

  @Column({ type: "varchar", nullable: true })
  deviceInfo?: string;

  @Column({ type: "varchar", nullable: true })
  ipAddress?: string;

  @Column({ type: "boolean", default: false })
  revoked: boolean;

  @Column({ type: "timestamp", nullable: true })
  expiresAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  lastUsedAt?: Date;

  @ManyToOne(() => User, user => user.sessions, { onDelete: "CASCADE" })
  user: User;

  async isTokenValid(token: string): Promise<boolean> {
    return await bcrypt.compare(token, this.tokenHash);
  }
}
