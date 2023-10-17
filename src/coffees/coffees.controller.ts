import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { response } from 'express';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto/pagination-query.dto';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeeService:CoffeesService){

    }

    @Get()
    findAll(@Query() paginationQuery:PaginationQueryDto){
        //const {limit,offset} = paginationQuery;分页操作
        return this.coffeeService.findAll(paginationQuery);   
        //return `This action returns all coffees.Limit:${limit},offset:${offset}`;
    } 

    @Get(':id') 
    findOne(@Param('id') id:string)
    {
        //return `This actiom return #${id} coffee`;
        return this.coffeeService.findOne(id);

    }
    @Post()
    create(@Body() createCoffeeDto:CreateCoffeeDto)
    {
        //return body;
        console.log(createCoffeeDto instanceof CreateCoffeeDto);
        return this.coffeeService.create(createCoffeeDto);
    }

    @Patch(':id')
    update(@Param('id') id:string  ,@Body() updateCoffeeDto:UpdateCoffeeDto){
        return this.coffeeService.update(id, updateCoffeeDto);
    }
    
    @Delete(':id')
    remove(@Param('id') id:string) {
        //return `This action removes #${id} coffee`;
        return this.coffeeService.remove(id);
    }

}
