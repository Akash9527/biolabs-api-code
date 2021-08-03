import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { MembershipChangeEnum } from '../enum/membership-change-enum';
import { RequestStatusEnum } from '../enum/request-status-enum';
import { ResidentCompany } from '../resident-company/resident-company.entity';
import { Item } from './item.entity';

@Entity({
  name: 'space_change_waitlist',
})
export class SpaceChangeWaitlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ResidentCompany, (residentCompany) => residentCompany.spaceChangeWaitlist, { eager: true })
  residentCompany: ResidentCompany;

  @OneToMany(() => Item, (items) => items.spaceChangeWaitlist)
  items: Item[];

  @CreateDateColumn({ type: "timestamp" })
  dateRequested: number;

  @Column({ nullable: true, default: null })
  desiredStartDate: number;

  @Column({ length: 510, nullable: true })
  planChangeSummary: string;

  @Column({ length: 510, nullable: true })
  graduateDescription: string;

  @Column({ nullable: false })
  requestedBy: string;

  @Column({ nullable: false, default: 0 })
  requestStatus: RequestStatusEnum;

  @Column({ nullable: true })
  fulfilledOn: number;

  @Column({ nullable: false })
  isRequestInternal: boolean;

  @Column({ length: 510, nullable: true, default: null })
  requestNotes: string;

  @Column({ length: 510, nullable: true, default: null })
  internalNotes: string;

  @Column({ length: 510, nullable: true, default: null })
  siteNotes: string;

  @Column({ nullable: false })
  priorityOrder: number;

  @Column("int", { array: true, nullable: true })
  site: number[];

  @Column({ nullable: false, default: 0 })
  membershipChange: MembershipChangeEnum;

  @Column({ nullable: true, default: null })
  requestGraduateDate: number;

  @Column({ nullable: true, default: null })
  marketPlace: boolean;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: number;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: number;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ nullable: true })
  modifiedBy: number;
}