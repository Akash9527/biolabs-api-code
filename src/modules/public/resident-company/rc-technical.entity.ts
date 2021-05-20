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
  name: 'resident_company_technical',
})
export class ResidentCompanyTechnical {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  company_id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 20 })
  linkedinLink: string;

  @Column({ length: 255 })
  publications: string;

  @Column({ default: false })
  joiningAsMember: boolean;

  @Column({ length: 255 })
  mainExecutivePOC: string;

  @Column({ length: 255 })
  laboratoryExecutivePOC: string;

  @Column({ length: 255 })
  invoicingExecutivePOC: string;

  @Column({ length: 255, enum: ['-1', '0', '1', '99'], default: '0' })
  status: status_enum;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;
}

export class ResidentCompanyTechnicalFillableFields {
  company_id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedinLink: string;
  publications: string;
  joiningAsMember: boolean;
  mainExecutivePOC: string;
  laboratoryExecutivePOC: string;
  invoicingExecutivePOC: string;
  status: status_enum;
}
