import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

type status_enum = '-1' | '0' | '1' | '99';

@Entity({
  name: 'sites',
})
export class Site {
  @PrimaryGeneratedColumn('rowid')
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  longName: string;

  @Column({ length: 255, nullable: true })
  standardizedAddress: string;

  @Column({ nullable: true })
  colorCode: string;

  @Column({ nullable: true })
  googleMapUrl: string;

  @Column({ nullable: true })
  siteMapBoxImgUrl: string;

  @Column({ length: 255, enum: ['-1', '0', '1', '99'] })
  status: status_enum;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;
}

export class SiteFillableFields {
  name: string;
  status: status_enum;
}