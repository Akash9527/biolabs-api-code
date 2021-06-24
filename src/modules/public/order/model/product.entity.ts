import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'product',
})
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 510, nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  recurrence: boolean;
  
  @Column({ nullable: true })
  cost: number;

  @Column({ nullable: false })
  createdBy: number;

  @Column({ nullable: false })
  modifiedBy: number;

  @Column({ enum: ['1', '99'], default: '1' })
  productStatus: number;

  @Column("int", { array: true, nullable: true })
  siteId: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  modifiedAt: Date;
}

export class ProductFillableFields {
  name: string;
  cost: number;
  description: string;
}