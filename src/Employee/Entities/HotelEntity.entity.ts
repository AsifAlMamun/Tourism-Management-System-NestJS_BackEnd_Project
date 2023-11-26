import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EmployeeEntity } from "./EmployeeEntity.entity";



@Entity("hotel")
export class HotelEntity{
    
        @PrimaryGeneratedColumn()
        id: number;
        @Column()
        HotelName: string;
     
        @Column()
        Rating: string;
        @Column()
        PriceRange: string;
       
        @Column()
        Address : string;
        @Column()
        Description : string;

        @ManyToOne(() => EmployeeEntity, employee => employee.hotels)
        employee: EmployeeEntity;
        }
