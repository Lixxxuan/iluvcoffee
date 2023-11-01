import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, StrictMatchKeysAndValues } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity/event.entity';
import { COFFEE_BARNDS } from './coffees.constants';
@Injectable({scope:Scope.TRANSIENT})
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository:Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository:Repository<Flavor>,
        private readonly connection:DataSource,
        @Inject(COFFEE_BARNDS) coffeeBrands:string[],
    )
    {
        console.log(coffeeBrands);
    }

    findAll(paginationQuery:PaginationQueryDto){
        const {limit,offset} = paginationQuery;
        return this.coffeeRepository.find(
            {
                relations:['flavors'],
                skip:offset,
                take:limit,
            }
        );
    }

    async findOne(id:string)
    {
        //const coffee = this.coffees.find(item => item.id === +id);
        const coffee = await this.coffeeRepository.findOne({where:{id:+id},relations:['flavors']});
    if(!coffee)
    {
        throw new HttpException(`Coffee #${id} not found!!`,HttpStatus.NOT_FOUND);
        
    }
    return coffee;
    }

    async create(createCoffeeDto:CreateCoffeeDto)
    {
        //this.coffees.push(createCoffeeDto);
        //return createCoffeeDto;//old

        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByname(name)),
        );
        const coffee = this.coffeeRepository.create({...createCoffeeDto,
            flavors,});
        return this.coffeeRepository.save(coffee);

    }

    async update(id:string,updateCoffeeDto:UpdateCoffeeDto){
        //const existingCoffee = this.findOne(id);
        //if(existingCoffee){
            //update the existing entity
        //}
        
        const flavors = updateCoffeeDto.flavors&&await Promise.all(
            updateCoffeeDto.flavors.map(name => this.preloadFlavorByname(name)),
        );

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors,
        });
        if(!coffee)
        {
            throw new NotFoundException(`Coffee #${id} not found !!!`);
        }
        return this.coffeeRepository.save(coffee);
    }

    async remove(id:string){
        /*const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
        if(coffeeIndex >= 0){
            this.coffees.splice(coffeeIndex,1);
        }*/
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    async recommendCoffee(coffee:Coffee){
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            coffee.recommendations++;

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = {coffeeId:coffee.id};

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();
        }catch(err){
            await queryRunner.rollbackTransaction();
        }finally{
            await queryRunner.release();
        }

        
    }

    private async preloadFlavorByname(name:string):Promise<Flavor>
    {
        const existingFlavor = await this.flavorRepository.findOne({where:{name:name}});
        if(existingFlavor){
            return existingFlavor;
        }
        return this.flavorRepository.create({name});

    }

}
