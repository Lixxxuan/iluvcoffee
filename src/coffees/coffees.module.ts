import { Inject, Injectable, Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity/flavor.entity';
import { COFFEE_BARNDS } from './coffees.constants';
@Injectable()
export class CoffeeBrandFactory{
    create(){


        return ['buddy brew','nescafe'];
    }
}
@Module({
    imports:[TypeOrmModule.forFeature([Coffee,Flavor,Event])],
    controllers:[CoffeesController],
    providers:[CoffeesService,
        /*{
            provide: ConfigService,
            useClass:process.env.NODE_ENV === 'development'?DevelopmentConfigService:ProductionConfigService
        },*/
        {
        provide:COFFEE_BARNDS,/*useValue*/useFactory:(brandsFactory:CoffeeBrandFactory)=>brandsFactory.create(),
        inject:[CoffeeBrandFactory],
    }],
    exports:[CoffeesService],
})
export class CoffeesModule {

}
