import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesController } from './coffees/coffees.controller';
import { CoffeesService } from './coffees/coffees.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { config } from 'process';
import{ConfigModule} from '@nestjs/config'
import *as Joi from '@hapi/joi'
@Module({
  imports: [
    ConfigModule.forRoot(
      {validationSchema:Joi.object({
        DATABASE_HOST:Joi.required(),
        DATABASE_PORT:Joi.number().default(5432),
      })
      }
    ),
    CoffeesModule,
    TypeOrmModule.forRoot(
    {    
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: +process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER,
    password: process.env.PASSWORD,
    database: process.env.NAME,
    autoLoadEntities: true,
    synchronize: true,
}

  ), CoffeeRatingModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],//原本此行及上一行有CoffeesController and CoffeesService 但是由于以防实例化两次的问题，已经迁移到coffees.module.ts
})
export class AppModule {}
