import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, StrictMatchKeysAndValues } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { relative } from 'path';
import { Flavor } from './entities/flavor.entity/flavor.entity';

@Injectable()
export class CoffeesService {
/*
    private coffees:Coffee[] =[
        {
            id:1,
            name:'Shipwreack Roast',
            brand:'Buddy Brew',
            flavors:['chocolate','vanilla']
        },
    ];
*/
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository:Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository:Repository<Flavor>
    ){}

    findAll(){
        return this.coffeeRepository.find(
            {
                relations:['flavors'],
                
            }
        );
    }

    async findOne(id:string){
        //const coffee = this.coffees.find(item => item.id === +id);
        const coffee = await this.coffeeRepository.findOne({where:{id:+id},relations:['flavors']});
    if(!coffee)
    {
        throw new HttpException(`Coffee #${id} not found!!`,HttpStatus.NOT_FOUND);
        
    }
    return coffee;
    }

    create(createCoffeeDto:CreateCoffeeDto)
    {
        //this.coffees.push(createCoffeeDto);
        //return createCoffeeDto;//old

        const flavor = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByname(name)),
        );
        const coffee = this.coffeeRepository.create(createCoffeeDto);
        return this.coffeeRepository.save(coffee);

    }

    async update(id:string,updateCoffeeDto:UpdateCoffeeDto){
        //const existingCoffee = this.findOne(id);
        //if(existingCoffee){
            //update the existing entity
        //}

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
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

    private async preloadFlavorByname(name:string):Promise<Flavor>
    {
        const existingFlavor = await this.flavorRepository.findOne({where:{name:name}});
        if(existingFlavor){
            return existingFlavor;
        }
        return this.flavorRepository.create({name});

    }

}
