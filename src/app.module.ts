import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesController } from './coffees/coffees.controller';
import { CoffeesService } from './coffees/coffees.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';

@Module({
  imports: [CoffeesModule,TypeOrmModule.forRoot(
    {    
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123456',
    database: 'lixuandb',
    autoLoadEntities: true,
    synchronize: true,
}

  ), CoffeeRatingModule],
  controllers: [AppController],
  providers: [AppService],//原本此行及上一行有CoffeesController and CoffeesService 但是由于以防实例化两次的问题，已经迁移到coffees.module.ts
})
export class AppModule {}
