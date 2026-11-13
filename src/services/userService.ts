import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { NotFoundError, ConflictError } from "../utils/error";
import bcrypt from "bcrypt";
import { createLogger } from "../utils/logger";

const logger = createLogger("UserService");
const userRepository = AppDataSource.getRepository(User);

interface FindAllOptions {
  page: number;
  limit: number;
  sort:
    | "id"
    | "name"
    | "email"
    | "isActive"
    | "age"
    | "createdAt"
    | "updatedAt";
  order: "ASC" | "DESC";
}

const userSelect = {
  id: true,
  name: true,
  email: true,
  isActive: true,
  age: true,
  createdAt: true,
  updatedAt: true,
};

export class UserService {
  // Get all users with pagination
  static async findAll(options: FindAllOptions): Promise<[User[], number]> {
    const { page, limit, sort, order } = options;
    const skip = (page - 1) * limit;

    return userRepository.findAndCount({
      select: userSelect,
      order: { [sort]: order },
      skip,
      take: limit,
    });
  }

  // Find user by ID
  static async findById(id: number): Promise<User> {
    const user = await userRepository.findOne({
      where: { id },
      select: userSelect,
    });

    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    return user;
  }

  // Create a new user
  static async create(data: {
    name: string;
    email: string;
    password: string;
    age?: number;
  }): Promise<User> {
    const existing = await userRepository.findOne({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictError("A user with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const savedUser = await userRepository.save(user);

    delete (savedUser as Partial<User>).password;

    logger.info("User created successfully", {
      userId: savedUser.id,
    });

    return savedUser;
  }

  // Update an existing user
  static async update(
    id: number,
    data: Partial<
      Pick<User, "name" | "email" | "password" | "isActive" | "age">
    >,
  ): Promise<User> {
    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    if (data.email && data.email !== user.email) {
      const existing = await userRepository.findOne({
        where: { email: data.email },
      });

      if (existing) {
        throw new ConflictError("A user with this email already exists");
      }
    }

    const updateData = { ...data };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    Object.assign(user, updateData);

    const updatedUser = await userRepository.save(user);

    delete (updatedUser as Partial<User>).password;

    logger.info("User updated successfully", { userId: id });

    return updatedUser;
  }

  // Delete a user
  static async delete(id: number): Promise<void> {
    const user = await userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    await userRepository.remove(user);

    logger.info("User deleted successfully", { userId: id });
  }
}