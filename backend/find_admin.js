const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ 
  datasources: { 
    db: { url: 'mysql://admin:Panduvani17@cloud-resource-db.cvwk4s00wqm7.ap-southeast-2.rds.amazonaws.com:3306/cloud_resources' } 
  } 
});

async function run() {
  const admins = await prisma.user.findMany({
    where: { userRoles: { some: { role: { name: 'Admin' } } } },
    select: { email: true, name: true }
  });
  console.log(JSON.stringify(admins, null, 2));
}

run().catch(console.error).finally(() => prisma.$disconnect());
