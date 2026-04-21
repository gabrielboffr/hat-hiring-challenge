import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { GetProposalsParams } from './dto/get-proposals-params.dto';
import { PrismaClient } from '@prisma/client/extension';

@Injectable()
export class ProposalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(body: any, tx?: PrismaClient) {
    const client = tx ?? this.prisma;
    return client.proposals.create({
      data: body,
    });
  }

  async findById(id: string, tx?: PrismaClient) {
    const client = tx ?? this.prisma;
    return client.proposals.findFirst({
      where: { id },
    });
  }

  async getProposals(params: GetProposalsParams) {
    const where: any = {};

    if (params.client) {
      where.client = params.client;
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.startDate) {
      where.startDate = {
        gte: new Date(params.startDate),
      };
    }

    if (params.endDate) {
      where.endDate = {
        lte: new Date(params.endDate),
      };
    }

    return this.prisma.proposals.findMany({ where });
  }

  async update(body: any, id: string, tx?: PrismaClient) {
    const client = tx ?? this.prisma;
    return client.proposals.update({ where: { id }, data: body });
  }
}
