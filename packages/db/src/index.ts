// import "dotenv/config";
import * as dotenv from "dotenv";
dotenv.config({ path: "./packages/db/.env" });
import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaClient } from "./generated/prisma/client.ts";

const connectionString = `${process.env.DATABASE_URL}`;

console.log(connectionString);

const adapter = new PrismaPg({ connectionString });
const prismaClient: PrismaClient = new PrismaClient({ adapter });

// export { prismaClient as prisma };
export default prismaClient;
