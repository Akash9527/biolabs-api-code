import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PasswordTransformer } from './password.transformer';
/**
 * -1 = De-active
 * 0 = Pending/Default/
 * 1 = Active
 * 96 = 
 * 97 = 
 * 98 = 
 * 99 = Soft delete (Deleted by admin)
 */
type status_enum = '-1' | '0' | '1' | '99';
type user_type = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  role: number;

  @Column("int", { array: true, nullable: true })
  site_id: number[];

  @Column("int", { nullable: true })
  companyId: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ length: 255, nullable: true })
  phoneNumber: string;

  @Column({ length: 255, enum: ['-1', '0', '1', '99'], default: '0' })
  status: status_enum;

  @Column({ length: 100, nullable: true })
  imageUrl: string;

  @Column({ length: 255, enum: ['0', '1', '2', '3', '4', '5', '6', '7'], default: '0' })
  userType: user_type;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
    nullable: true
  })
  password: string;

  toJSON() {
    const { ...self } = this;
    return self;
  }

  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;
}

export class UserFillableFields {
  email: string;
  password: string;
  role: number;
  site_id: number[];
  companyId: number;
  firstName: string;
  lastName: string;
  title: string;
  phoneNumber: string;
  status: status_enum;
  userType: user_type;
  imageUrl: string;
}
