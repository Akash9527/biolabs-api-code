import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';


@Entity({
  name: 'order_product',
})
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  companyId: number;

  // Status will be "0" if invoice is not created, "1" if invoice is created. 
  @Column({ nullable: false })
  status: number;

  @Column({ length: 510, nullable: true })
  productName: string;

  @Column({ length: 510, nullable: false })
  productDescription: string;

  @Column({ nullable: true })
  cost: number;

  @Column({ nullable: true })
  quantity: number;

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
}

export class OrderProductFillableFields {
  productName: string;
  cost: number;
  recurrence: boolean;
  currentCharge: boolean;
  startDate: number;
  endDate: number;
  quantity : number;
}