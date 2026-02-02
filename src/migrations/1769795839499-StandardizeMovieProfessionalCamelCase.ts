import { MigrationInterface, QueryRunner } from 'typeorm'

export class StandardizeMovieProfessionalCamelCase1769795839499
  implements MigrationInterface
{
  name = 'StandardizeMovieProfessionalCamelCase1769795839499'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP CONSTRAINT "FK_718083ac75c9b833ab38e32847d"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP CONSTRAINT "FK_fd57e025c4014a370625270bea3"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP COLUMN "movie_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP COLUMN "created_at"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP COLUMN "professional_id"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD "movieId" integer NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD "professionalId" integer NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD CONSTRAINT "FK_1a658a9e10ab19a016d1b2ef996" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD CONSTRAINT "FK_1749d9671686042de360035351b" FOREIGN KEY ("professionalId") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP CONSTRAINT "FK_1749d9671686042de360035351b"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP CONSTRAINT "FK_1a658a9e10ab19a016d1b2ef996"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP COLUMN "createdAt"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP COLUMN "professionalId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" DROP COLUMN "movieId"`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD "professional_id" integer NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD "movie_id" integer NOT NULL`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD CONSTRAINT "FK_fd57e025c4014a370625270bea3" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "movie_professionals" ADD CONSTRAINT "FK_718083ac75c9b833ab38e32847d" FOREIGN KEY ("professional_id") REFERENCES "professionals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    )
  }
}
