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

  @Column({ length: 255 })
  site_id: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255, enum:['-1','0','1','99'], default:'1' })
  status: status_enum;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
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
  site_id:string;
}
