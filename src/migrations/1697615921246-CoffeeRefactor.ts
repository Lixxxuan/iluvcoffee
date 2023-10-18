import { MigrationInterface, QueryRunner } from "typeorm"

export class CoffeeRefactor1697615921246 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "coffee" RENAME CLOUMN "name" TO "title"`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE ""coffee" RENAME COLUMN "title" to "name"`,
        );
    }

}
