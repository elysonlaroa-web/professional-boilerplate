import { Response } from "express";

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    ...(message && { message }),
    data,
  });
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = "Resource created successfully",
) => {
  return sendSuccess(res, data, message, 201);
};

export const sendNoContent = (res: Response) => {
  return res.status(204).send();
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
) => {
  return res.status(200).json({
    success: true,
    data,
    meta,
  });
};

export const createPaginationMeta = (
  total: number,
  page: number,
  limit: number,
): PaginationMeta => {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};