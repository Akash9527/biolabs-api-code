import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';

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

  @ManyToMany(type => Order, order => order.invoices)
  @JoinTable()
  orders: Order[];

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