import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CreateProposalsDto } from './dto/create-proposals.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetProposalsParams } from './dto/get-proposals-params.dto';
import { ProposalsStatus } from '@prisma/client';
import type { ApplyProposalDiscount } from './dto/apply-proposal-discount.dto';

@ApiTags('propostas')
@Controller('propostas')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  create(@Body() dto: CreateProposalsDto) {
    return this.proposalsService.create(dto);
  }

  @ApiQuery({
    name: 'client',
    required: false,
    description: 'Usado para filtrar proposta por cliente',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ProposalsStatus,
    description: 'Usado para filtrar por status da proposta',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Usado para filtrar a data de início',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Usado para filtrar a data de término',
  })
  @Get()
  getProposals(@Query() params: GetProposalsParams) {
    return this.proposalsService.getProposals(params);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.proposalsService.findById(id);
  }

  @Post(':id/aplicar-desconto')
  applyDiscount(@Body() dto: ApplyProposalDiscount, @Param('id') id: string) {
    return this.proposalsService.applyDiscount(dto, id);
  }
}
