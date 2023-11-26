import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AdminEntity } from "./AdminEntity.entity";
import { DestinationEntity } from "./DestinationEntity.entity";

@Entity("content")
export class ContentEntity {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title:string;

    @Column()
    description:string;

    @Column()
    createdAt:Date;

    @ManyToOne(() => AdminEntity, admin => admin.contents)
    admin : AdminEntity;

    @ManyToOne(() => DestinationEntity, destination => destination.contents, { nullable: true })
    destination: DestinationEntity;


}