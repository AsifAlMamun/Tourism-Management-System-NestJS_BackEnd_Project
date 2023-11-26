import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("transport")
export class TransportEntity{

    
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    capacity: number;
    @Column()
    availability: boolean;
    @Column()
    cost: number;
    @Column()
    departurePoint: string;
    @Column()
    arrivalPoint: string;
    @Column()
    schedule: string;
    @Column()
    facilities: string;
    

}
