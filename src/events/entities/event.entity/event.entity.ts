import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
@Index(['name','type'])//索引，在性能对某个实体特别重要的时候，就可以使用
@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    type: string;

    @Index()
    @Column()
    name: string;

    @Column('json')
    payload:Record<string,any>;
}
