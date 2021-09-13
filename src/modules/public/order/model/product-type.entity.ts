import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity({
  name: 'product_type',
})
export class ProductType {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ nullable: true })
  productTypeName: string;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ nullable: true })
  modifiedBy: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  modifiedAt: Date;

  @OneToMany(() => Product, (product) => product.productType)
  product?: Product[];
}

export class ProductFillableFields {
  productTypeName: string;
  createdBy: number;
  modifiedBy: number
}