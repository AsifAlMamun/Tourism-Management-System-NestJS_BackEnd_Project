import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { HotelEntity } from "./HotelEntity.entity";
import { TravelGuideEntity } from "./TravelGuideEnity.entity";



@Entity("employee")
export class EmployeeEntity{
    
@PrimaryGeneratedColumn()
id: number;
@Column()
firstname: string;
@Column()
lastname: string;
@Column()
username: string;
@Column()
email: string;
@Column()
password: string;
@Column()
address : string;
@Column()
contact : string;
@Column()
filename:string;

@OneToMany(() => HotelEntity, hotel => hotel.employee)
    hotels: HotelEntity[];


@OneToMany(() => TravelGuideEntity, travelGuide => travelGuide.guide)
    travelGuides: TravelGuideEntity[];
    
}