import { Request, Response } from "express";
import { UserService } from "../services/userService";
import {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendPaginated,
  createPaginationMeta,
} from "../utils/response";
import { createLogger } from "../utils/logger";

const logger = createLogger("UserController");

const allowedSortFields = [
  "id",
  "name",
  "email",
  "isActive",
  "age",
  "createdAt",
  "updatedAt",
] as const;

type SortField = (typeof allowedSortFields)[number];

export class UserController {
  // GET ALL USERS
  static async getAll(req: Request, res: Response): Promise<void> {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "DESC",
    } = req.query;

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    const sortValue = String(sort);

    const sortField: SortField = (
      allowedSortFields as readonly string[]
    ).includes(sortValue)
      ? (sortValue as SortField)
      : "createdAt";

    const sortOrder = String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const [users, total] = await UserService.findAll({
      page: currentPage,
      limit: pageLimit,
      sort: sortField,
      order: sortOrder,
    });

    const meta = createPaginationMeta(total, currentPage, pageLimit);

    logger.info("Users retrieved", {
      count: total,
      page: currentPage,
      limit: pageLimit,
    });

    sendPaginated(res, users, meta);
  }

  // GET USER BY ID
  static async getById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);

    const user = await UserService.findById(id);

    logger.info("User retrieved", { userId: id });

    sendSuccess(res, user);
  }

  // CREATE USER
  static async create(req: Request, res: Response): Promise<void> {
    const user = await UserService.create(req.body);

    logger.info("User created", {
      userId: user.id,
      email: user.email,
    });

    sendCreated(res, user, "User created successfully");
  }

  // UPDATE USER
  static async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);

    const user = await UserService.update(id, req.body);

    logger.info("User updated", { userId: id });

    sendSuccess(res, user, "User updated successfully");
  }

  // DELETE USER
  static async delete(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);

    await UserService.delete(id);

    logger.info("User deleted", { userId: id });

    sendNoContent(res);
  }
}