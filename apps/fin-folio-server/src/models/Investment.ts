import { InstrumentType } from "@/enums/InstrumentType";
import { getIsInvalidMessage } from "@/utils";
import { IsDate, IsDecimal, IsEnum, IsUUID } from "class-validator";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from "typeorm";
import { Category } from "./Category";
import { User } from "./User";
import { ValidationEntity } from "./ValidationEntity";

@Entity("Investments")
@Unique(["publicId"])
export class Investment extends ValidationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "uuid", unique: true, default: () => "gen_random_uuid()" })
  @IsUUID(4, { message: getIsInvalidMessage("Public ID") })
  publicId: string;

  @Column("double precision")
  @IsDecimal(
    { decimal_digits: "2" },
    { message: getIsInvalidMessage("Amount") }
  )
  investedAmount: number;

  @Column("double precision")
  @IsDecimal(
    { decimal_digits: "2" },
    { message: getIsInvalidMessage("Current Value") }
  )
  currentValue: number;

  @Column({ type: "enum", enum: InstrumentType })
  @IsEnum(InstrumentType, { message: getIsInvalidMessage("Instrument Type") })
  instrumentType: InstrumentType;

  @Column({ type: "date" })
  @IsDate({ message: getIsInvalidMessage("Purchase Date") })
  purchasedAt: Date;

  @ManyToOne(() => User, user => user.investments)
  user: User;

  @ManyToOne(() => Category, category => category.investments)
  category: Category;
}
