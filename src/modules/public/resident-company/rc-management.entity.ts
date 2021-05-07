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
  name: 'resident_company_management',
})
export class ResidentCompanyManagement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  company_id: number;

  @Column({ length: 255 })
  full_name: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  job_title: string;

  @Column({ length: 255 })
  publications: string;

  @Column({ length: 255 })
  academic_institution: string;

  @Column({ length: 255, enum: ['-1', '0', '1', '99'], default: '0' })
  status: status_enum;

}

export class ResidentCompanyManagementFillableFields {
  company_id: number;
  full_name: string;
  email: string;
  job_title: string;
  publications: string;
  academic_institution: string;
  status: status_enum;
}