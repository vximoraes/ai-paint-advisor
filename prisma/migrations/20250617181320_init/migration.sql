-- CreateTable
CREATE TABLE "Tinta" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "tipo_parede" TEXT NOT NULL,
    "ambiente" TEXT NOT NULL,
    "acabamento" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "linha" TEXT NOT NULL,

    CONSTRAINT "Tinta_pkey" PRIMARY KEY ("id")
);
