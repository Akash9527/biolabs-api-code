import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


@Entity({
  name: 'order_product',
})
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  companyId: number;

  @Column({ nullable: true })
  productId: number;

  @Column({ nullable: true })
  month: number;

  // Status will be "0" if invoice is not created, "1" if invoice is created. 
  @Column({ nullable: false })
  status: number;

  @Column({ length: 510, nullable: false })
  productName: string;

  @Column({ length: 510, nullable: true })
  productDescription: string;

  @Column({ nullable: true })
  cost: number;

  @Column({ nullable: true })
  quantity: number;

  @Column({ default: false })
  recurrence: boolean;

  @Column({ default: false })
  currentCharge: boolean;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;

  @Column({ default: true })
  manuallyEnteredProduct: boolean;
}

export class OrderProductFillableFields {
  productName: string;
  productDescription: string;
  productId: number;
  month: number;
  cost: number;
  recurrence: boolean;
  currentCharge: boolean;
  startDate: number;
  endDate: number;
  quantity: number;
  startDtNull: boolean;
  endDtNull: boolean;
  manuallyEnteredProduct: boolean;
}