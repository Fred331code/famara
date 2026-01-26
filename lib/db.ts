import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL || "postgresql://build:build@localhost:5432/build",
});

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}
