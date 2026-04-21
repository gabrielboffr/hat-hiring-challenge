-- CreateTable
CREATE TABLE "PricingTable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "seniority" TEXT NOT NULL DEFAULT 'JUNIOR',
    "costPerHour" DECIMAL NOT NULL,
    "billRatePerHour" DECIMAL NOT NULL,
    "targetMargin" DECIMAL NOT NULL
);

-- CreateTable
CREATE TABLE "DiscountTable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "approverLevel" TEXT NOT NULL DEFAULT 'SALES_EXECUTIVE',
    "maxAllowedDiscount" DECIMAL NOT NULL
);

-- CreateTable
CREATE TABLE "Professionals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "seniority" TEXT NOT NULL DEFAULT 'JUNIOR',
    "costPerHour" DECIMAL NOT NULL,
    "billRatePerHour" DECIMAL NOT NULL
);

-- CreateTable
CREATE TABLE "Proposals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "client" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "totalCost" DECIMAL,
    "totalRevenue" DECIMAL,
    "grossMarginPct" DECIMAL
);

-- CreateTable
CREATE TABLE "ProposalProfessional" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "proposalId" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "estimatedHours" INTEGER NOT NULL,
    CONSTRAINT "ProposalProfessional_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProposalProfessional_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professionals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiscountProposalApplied" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "proposalId" TEXT NOT NULL,
    "approverLevel" TEXT NOT NULL,
    "discountApplied" DECIMAL NOT NULL,
    "approvedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originTotalRevenue" DECIMAL NOT NULL,
    CONSTRAINT "DiscountProposalApplied_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DiscountProposalApplied_approverLevel_fkey" FOREIGN KEY ("approverLevel") REFERENCES "DiscountTable" ("approverLevel") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PricingTable_costPerHour_key" ON "PricingTable"("costPerHour");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountTable_approverLevel_key" ON "DiscountTable"("approverLevel");
