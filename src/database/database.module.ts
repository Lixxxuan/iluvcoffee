import { DynamicModule, Module } from '@nestjs/common';
import { OPTIONAL_DEPS_METADATA } from '@nestjs/common/constants';
import { ConnectionOptions } from 'tls';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
        providers:[{
            provide:'CONNECTION',
            useValue:new DataSource({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
            }),
            
        }],

})
export class DatabaseModule {
    static register(options:DataSourceOptions):DynamicModule{
        return {
            module:DatabaseModule,
            providers:[
                {
                    provide:'CONNECTION',
                    useValue:new DataSource(options),
                },
            ],
        };
    }
}
