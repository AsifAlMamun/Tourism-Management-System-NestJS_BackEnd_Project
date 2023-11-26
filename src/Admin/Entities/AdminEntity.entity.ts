import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ContentEntity } from "./ContentEntity.entity";

@Entity("admin")
export class AdminEntity {

@PrimaryGeneratedColumn()
id: number;

@Column()
firstName: string;

@Column()
lastName:string;

@Column()
username:string;

@Column()
email: string;

@Column()
address: string;

@Column()
password: string;

@Column()
filename: string;

@OneToMany (() => ContentEntity , content => content.admin, { cascade: true })
contents : ContentEntity[];

}
