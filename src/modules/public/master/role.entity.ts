import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

type status_enum = '-1' | '0' | '1' | '99';

@Entity({
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, enum:['-1','0','1','99'] })
  status: status_enum;

}

export class RoleFillableFields {
  name: string;
  status: status_enum;
}
