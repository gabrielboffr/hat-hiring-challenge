import { ApiProperty } from '@nestjs/swagger';
import { Seniority } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

export class CreateProfessionalDto {
  @ApiProperty({
    example: 'João da Silva',
    description: 'Usado para inserir o nome do profissional',
  })
  @IsString()
  name: string;

  costPerHour: Decimal;
  billRatePerHour: Decimal;

  @ApiProperty({
    enum: Seniority,
    example: 'Junior',
    description:
      'Usado para definir a senioridade do profissional, se não especificado, é definido como Junior',
  })
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(Seniority)
  seniority: Seniority;
}
