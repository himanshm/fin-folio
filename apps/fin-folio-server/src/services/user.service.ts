import { AppDataSource } from "@/data-source";
import { UserRepository } from "@/repositories";
import { ResourceNotFoundError } from "@/utils";
import { DataSource, EntityManager } from "typeorm";

export const createUserService = (
  dataContext: DataSource | EntityManager = AppDataSource
) => {
  const userRepository = new UserRepository(dataContext);

  const getUserIdentity = async (publicId: string) => {
    const user = await userRepository.findOneByPublicIdForIdentity(publicId);

    if (!user) {
      throw new ResourceNotFoundError("User");
    }

    return user;
  };

  return {
    getUserIdentity
  };
};

export const userService = createUserService(AppDataSource);
