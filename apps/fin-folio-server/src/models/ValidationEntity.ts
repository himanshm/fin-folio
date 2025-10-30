import { validateOrReject } from "class-validator";
import { BeforeInsert, BeforeUpdate } from "typeorm";

export abstract class ValidationEntity {
  @BeforeInsert()
  async validateOnInsert() {
    await validateOrReject(this);
  }

  @BeforeUpdate()
  async validateOnUpdate() {
    await validateOrReject(this, { skipMissingProperties: true });
  }
}
