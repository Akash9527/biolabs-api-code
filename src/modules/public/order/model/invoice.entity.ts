import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'invoice',
})
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  companyId: number;

  @Column({ nullable: true })
  startDate: number;

  @Column({ nullable: true })
  endDate: number;

  @Column({ nullable: true })
  totalCost: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  // @Column({ nullable: false })
  // createdBy: number;

}

export class InvoiceFillableFields {
  startDate: number;
  endDate: number;
  totalCost: number;
  recurrence: boolean;
  currentCharge: boolean;
}