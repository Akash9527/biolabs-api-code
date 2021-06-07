import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({
  name: 'order_product',
})
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderProducts)
  order?: Order;

  @Column({ length: 510, nullable: true })
  productName: string;

  @Column({ length: 510, nullable: true })
  productDescription: string;

  @Column({ nullable: true })
  cost: number;

  @Column({ default: false })
  recurrence: boolean;

  @Column({ default: false })
  currentCharge: boolean;

  @Column({ type: 'timestamptz' })
  startDate: Date;

  @Column({ type: 'timestamptz' })
  endDate: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;

  // @Column({ nullable: false })
  // createdBy: number;

  // @Column({ nullable: false })
  // modifiedBy: number;

}

export class OrderProductFillableFields {
  productName: string;
  cost: number;
  recurrence: boolean;
  currentCharge: boolean;
  startDate: number;
  endDate: number;
}