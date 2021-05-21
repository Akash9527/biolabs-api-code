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
  name: 'resident_company_documents',
})
export class ResidentCompanyDocuments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({})
  company_id: number;

  @Column("int", { array: true })
  doc_type: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  link: string;

  @Column({ length: 255, enum: ['-1', '0', '1', '99'], default: '0' })
  status: status_enum;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;
}

export class ResidentCompanyDocumentsFillableFields {
  email: string;
  company_id: number;
  doc_type: string;
  name: string;
  link: string;
  status: status_enum;
}