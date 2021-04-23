import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PasswordTransformer } from './password.transformer';

type status_enum = '-1' | '0' | '1' | '99';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({  })
  role: number;

  @Column("int", { array: true })
  site_id: number[];

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  phoneNumber: string;

  @Column({ length: 255, enum:['-1','0','1','99'], default:'1' })
  status: status_enum;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
    nullable:true
  })
  password: string;

  toJSON() {
    const { password, ...self } = this;
    return self;
  }
}

export class UserFillableFields {
  email: string;
  password: string;
  role: number;
  site_id:number[];
  firstName:string;
  lastName:string;
  title:string;
  phoneNumber:string;
}
