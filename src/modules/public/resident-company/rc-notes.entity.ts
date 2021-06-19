import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ResidentCompany } from "./resident-company.entity";

@Entity({
    name: 'notes',
})
export class Notes {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    createdBy: number;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @Column({ length: 500, nullable: false })
    notes: string;

    @Column({ enum: ['1', '99'], default: '1' })
    notesStatus: number;

    @ManyToOne(() => ResidentCompany, (residentCompany) => residentCompany.notes, { eager: true })
    residentCompany: ResidentCompany;
}