import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { EmployeeEntity } from "./EmployeeEntity.entity";
import { PackageEntity } from "src/Admin/Entities/PackageEntity.entity";




@Entity("travelguide")
export class TravelGuideEntity{
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    DestinationName: string;
    @Column()
    Address: string;
    @Column()
    Description: string;
    @Column()
    GuideName: string;
    @Column()
    Contact : string;
    @Column()
    PackageName : string;
    @Column()
    Price : string;


    @OneToOne(() => PackageEntity, packageEntity => packageEntity.travelGuide)
    @JoinColumn({name:"packageID"})
    package: PackageEntity;

    @ManyToOne(() => EmployeeEntity, employee => employee.travelGuides)
    @JoinColumn({ name: "employeeID" }) 
    guide: EmployeeEntity;

  
}