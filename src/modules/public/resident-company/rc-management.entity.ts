import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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
  companyId: number;

  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 20, nullable: true })
  linkedinLink: string;

  @Column({ length: 255, nullable: true })
  publications: string;

  @Column({ length: 255, nullable: true })
  academicAffiliation: string;

  @Column({ default: false })
  joiningAsMember: boolean;

  @Column({ length: 255, nullable: true })
  mainExecutivePOC: string;

  @Column({ length: 255, nullable: true })
  laboratoryExecutivePOC: string;

  @Column({ length: 255, nullable: true })
  invoicingExecutivePOC: string;

  @Column({ length: 255, enum: ['-1', '0', '1', '99'], default: '0' })
  status: status_enum;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;
}

export class ResidentCompanyManagementFillableFields {
  companyId: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedinLink: string;
  publications: string;
  academicAffiliation: string;
  joiningAsMember: boolean;
  mainExecutivePOC: string;
  laboratoryExecutivePOC: string;
  invoicingExecutivePOC: string;
  status: status_enum;
}