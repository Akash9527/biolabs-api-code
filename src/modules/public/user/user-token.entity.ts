import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

type status_enum = '-1' | '0' | '1' | '99';

@Entity({
  name: 'user_tokens',
})
export class UserToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({  })
  user_id: number;

  @Column({ length: 255 })
  token: string;

  @Column({ length: 255, enum:['-1','0','1','99'], default:'1' })
  status: status_enum;
  
  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;
}

export class UserTokenFillableFields {
  token: number;
  user_id:string;
  status:string;
}
