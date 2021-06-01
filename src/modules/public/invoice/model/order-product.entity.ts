import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'order_product',
})
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 510, nullable: true })
  productName: string;

  @Column({ nullable: true })
  cost: number;

  @Column({ default: false })
  recurrence: boolean;

  @Column({ default: false })
  currentCharge: boolean;

  @Column({ nullable: true })
  startDate: number;

  @Column({ nullable: true })
  endDate: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;

  @Column({ nullable: false })
  createdBy: number;

  @Column({ nullable: false })
  modifiedBy: number;

}

export class OrderProductFillableFields {
  productName: string;
  cost: number;
  recurrence: boolean;
  currentCharge: boolean;
  startDate: number;
  endDate: number;
}