import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { SpaceChangeWaitlist } from './space-change-waitlist.entity';

@Entity({
    name: 'items',
})
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => SpaceChangeWaitlist, (spaceChangeWaitlist) => spaceChangeWaitlist.items, { eager: true })
    spaceChangeWaitlist: SpaceChangeWaitlist;

    @Column({ length: 510, nullable: false })
    itemName: string;

    @Column({ nullable: false })
    currentQty: number;

    @Column({ nullable: false })
    desiredQty: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: number;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: number;

}