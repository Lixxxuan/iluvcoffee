import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Flavor } from "./flavor.entity/flavor.entity";
@Entity() //sql table == 'coffees'
export class Coffee{

    @PrimaryGeneratedColumn() //主键列
    id:number;

    @Column()//普通列
    name:string;

    @Column()
    brand:string;

    @JoinTable()
    @ManyToMany(type =>Flavor,flavor=>flavor.coffee,{
        cascade:true,//insert 级联插入
    })
    flavors:string[];
    
}