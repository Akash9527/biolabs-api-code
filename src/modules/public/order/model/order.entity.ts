import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Invoice } from './invoice.entity';
import { OrderProduct } from './order-product.entity';

@Entity({
  name: 'order',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProducts?: OrderProduct[];

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

  @ManyToMany(type => Invoice, invoice => invoice.orders)
  invoices: Invoice[];

}

export class OrderFillableFields {
  companyId: number;
  invoiceId: number;
}