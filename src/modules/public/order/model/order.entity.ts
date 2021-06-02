import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'order',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  companyId: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @UpdateDateColumn({ type: "timestamp" })
  modifiedAt: number;

  // @Column({ nullable: false })
  // createdBy: number;

  // @Column({ nullable: false })
  // modifiedBy: number;

}

export class OrderFillableFields {
  companyId: number;
  invoiceId: number;
}