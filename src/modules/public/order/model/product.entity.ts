import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

  @Column({ nullable: true })
  cost: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @Column({ nullable: false })
  createdBy: number;

}

export class ProductFillableFields {
  name: string;
  cost: number;
  description: string;
}