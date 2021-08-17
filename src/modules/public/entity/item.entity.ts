import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SpaceChangeWaitlist } from './space-change-waitlist.entity';

@Entity({
    name: 'items',
})
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    spaceChangeWaitlist_id: number;

    @ManyToOne(() => SpaceChangeWaitlist, (spaceChangeWaitlist) => spaceChangeWaitlist.items)
    @JoinColumn({ name: 'spaceChangeWaitlist_id', referencedColumnName: 'id' })
    spaceChangeWaitlist: SpaceChangeWaitlist;

    @Column({ nullable: false })
    productTypeId: number;

    @Column({ length: 510, nullable: false })
    itemName: string;

    @Column({ nullable: false })
    currentQty: number;

    @Column({ nullable: true })
    desiredQty: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: number;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: number;

}