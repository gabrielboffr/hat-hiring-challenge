import { ApiProperty } from '@nestjs/swagger';
import { ProposalsStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateProposalsDto {
  @ApiProperty({
    example: 'Empresa XYZ',
    description: 'Utilizado para falar o nome ou empresa do cliente',
  })
  client: string;

  @ApiProperty({
    example: 'Modernização de Sistemas Legados',
    description: 'Utilizado para descrever a necessidade do cliente',
  })
  description: string;

  @ApiProperty({
    example: '2025-02-01',
    description: 'Utilizado para dizer o início do desenvolvimento',
  })
  startDate: Date;

  @ApiProperty({
    example: '2025-05-31',
    description:
      'Utilizado para falar o prazo estimado de término do desenvolvimento',
  })
  endDate: Date;

  @ApiProperty({
    enum: ProposalsStatus,
    example: 'Pending',
    description: 'Usado para definir o status da proposta',
    required: false,
  })
  @Transform(({ value }) => value.toUpperCase())
  status: ProposalsStatus;

  @ApiProperty({
    type: () => [CreateProposalProfessionalDto],
    description: 'Lista de profissionais envolvidos na proposta',
    required: true,
    minItems: 1,
  })
  professionals: CreateProposalProfessionalDto[];
}

export class CreateProposalProfessionalDto {
  @ApiProperty({
    example: 'uuid-do-profissional',
    description: 'ID do profissional (opcional quando enviar name)',
    required: false,
  })
  id?: string;

  @ApiProperty({
    example: 'Ana Souza',
    description: 'Nome do profissional (opcional quando enviar id)',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'Junior',
    description: 'Senioridade informada para referencia',
    required: false,
  })
  seniority?: string;

  @ApiProperty({
    example: 120,
    description: 'Horas estimadas para o profissional na proposta',
    required: true,
  })
  estimatedHours: number;
}
