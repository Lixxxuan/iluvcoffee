import { Column, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Coffee } from "../coffee.entity";

export class FlavorEntity {}
@Entity()
export class Flavor{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @ManyToMany(type => Coffee,coffee =>coffee.flavors)
    coffee : Coffee[];
}