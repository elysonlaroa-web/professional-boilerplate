import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from "typeorm";

@Entity("users")
@Index(["email"], { unique: true })
@Index(["verificationToken"], { unique: true })
@Index(["resetPasswordToken"], { unique: true })
export class User {
  @PrimaryGeneratedColumn({ type: "int" })
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255, select: false })
  password!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  // Email verification fields
  @Column({ type: "boolean", default: false })
  isVerified!: boolean;

  @Column({ type: "varchar", length: 255, nullable: true, select: false })
  verificationToken!: string | null;

  @Column({ type: "datetime", nullable: true })
  verificationTokenExpiry!: Date | null;

  // Password reset fields
  @Column({ type: "varchar", length: 255, nullable: true, select: false })
  resetPasswordToken!: string | null;

  @Column({ type: "datetime", nullable: true })
  resetPasswordExpiry!: Date | null;

  // Existing field
  @Column({ type: "int", nullable: true })
  age!: number | null;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}