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
  name: 'resident_company_technical',
})
export class ResidentCompanyTechnical {
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

  @Column({ default: false, nullable: true })
  joiningAsMember: boolean;

  @Column({ nullable: true })
  mainExecutivePOC: boolean;

  @Column({  nullable: true })
  laboratoryExecutivePOC: boolean;

  @Column({  nullable: true })
  invoicingExecutivePOC: boolean;

  @Column({ length: 255, enum: ['-1', '0', '1', '99'], default: '0' })
  status: status_enum;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;
}

export class ResidentCompanyTechnicalFillableFields {
  companyId: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedinLink: string;
  publications: string;
  joiningAsMember: boolean;
  mainExecutivePOC: boolean;
  laboratoryExecutivePOC: boolean;
  invoicingExecutivePOC: boolean;
  status: status_enum;
}