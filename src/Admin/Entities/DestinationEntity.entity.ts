import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PackageEntity } from "./PackageEntity.entity";
import { ContentEntity } from "./ContentEntity.entity";

@Entity("destination")
export class DestinationEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @Column()
    description:string;

    @Column()
    imageUrl:string;

    @Column()
    activities:string;

    @OneToOne(() => PackageEntity, packages => packages.destination)
    package: PackageEntity; 

    @OneToMany (() => ContentEntity , content => content.destination, { cascade: true })
    contents : ContentEntity[];
}