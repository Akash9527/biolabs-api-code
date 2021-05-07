import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
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

@Entity({
  name: 'resident-company-technical',
})
export class ResidentCompanyTechnical {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  company_id: number;

  @Column({ length: 255 })
  full_name: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  publications: string;

  @Column({ length: 255, enum: ['-1', '0', '1', '99'], default: '0' })
  status: status_enum;

}

export class ResidentCompanyTechnicalFillableFields {
  company_id: number;
  full_name: string;
  title: string;
  publications: string;
  status: status_enum;
}
