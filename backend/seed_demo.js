const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://admin:Panduvani17@cloud-resource-db.cvwk4s00wqm7.ap-southeast-2.rds.amazonaws.com:3306/cloud_resources"
    }
  }
});

const demoUsers = [
  { name: 'Arjun Reddy', email: 'arjun@techcorp.in', projectName: 'TechCorp E-Commerce', desc: 'Main production environment for E-Commerce platform' },
  { name: 'Priya Sharma', email: 'priya.s@innovate.co', projectName: 'AI Analytics Pipeline', desc: 'Data processing and ML model training cluster' },
  { name: 'David Chen', email: 'david@startup.io', projectName: 'SaaS Alpha MVP', desc: 'Early access staging servers' },
  { name: 'Sarah Jenkins', email: 's.jenkins@fintech.com', projectName: 'FinTech Secure Gateway', desc: 'PCI compliant transaction processors' },
  { name: 'Rahul Desai', email: 'rahul.d@media.in', projectName: 'Media Transcoding', desc: 'High CPU cluster for video rendering' },
  { name: 'Elena Rostova', email: 'elena@healthnet.org', projectName: 'HealthNet Records', desc: 'HIPAA compliant database and app servers' }
];

async function seed() {
  console.log("Seeding demo accounts...");
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Get customer role
  let customerRole = await prisma.role.findUnique({ where: { name: 'Customer' } });
  if (!customerRole) {
    customerRole = await prisma.role.create({ data: { name: 'Customer', description: 'Standard user' } });
  }

  // Ensure some resources exist to allocate
  let resources = await prisma.resource.findMany({ where: { status: 'available' } });
  if (resources.length < 12) {
    await prisma.resource.createMany({
      data: [
        { name: 't3.xlarge-db', type: 'Database', region: 'ap-south-1', baseCost: 150, cpu: 4, ram: 16, disk: 500, status: 'available' },
        { name: 'c5.2xlarge-app', type: 'VM', region: 'ap-south-1', baseCost: 200, cpu: 8, ram: 16, disk: 100, status: 'available' },
        { name: 's3-bucket-tier1', type: 'Storage', region: 'us-east-1', baseCost: 50, cpu: null, ram: null, disk: 2000, status: 'available' },
        { name: 'm5.large-web', type: 'VM', region: 'eu-west-1', baseCost: 80, cpu: 2, ram: 8, disk: 50, status: 'available' },
        { name: 'r5.xlarge-cache', type: 'VM', region: 'ap-south-1', baseCost: 180, cpu: 4, ram: 32, disk: 100, status: 'available' },
        { name: 'rds-postgres', type: 'Database', region: 'us-west-2', baseCost: 250, cpu: 8, ram: 32, disk: 1000, status: 'available' }
      ]
    });
    resources = await prisma.resource.findMany({ where: { status: 'available' } });
  }

  for (const [index, data] of demoUsers.entries()) {
    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          userRoles: {
            create: { roleId: customerRole.id }
          }
        }
      });
      console.log(`Created user: ${user.name}`);
    }

    // Check if project exists
    let project = await prisma.project.findFirst({ where: { userId: user.id } });
    if (!project) {
      project = await prisma.project.create({
        data: {
          name: data.projectName,
          description: data.desc,
          userId: user.id,
          status: 'active'
        }
      });
      console.log(`Created project: ${project.name}`);

      // Allocate 1-2 random resources to the project
      const numResourcesToAllocate = (index % 2) + 1; // 1 or 2
      for (let i = 0; i < numResourcesToAllocate; i++) {
        // Refresh available resources
        const available = await prisma.resource.findMany({ where: { status: 'available' } });
        if (available.length > 0) {
          const resToAlloc = available[Math.floor(Math.random() * available.length)];
          
          await prisma.resourceAllocation.create({
            data: {
              projectId: project.id,
              resourceId: resToAlloc.id,
              status: 'active'
            }
          });
          
          await prisma.resource.update({
            where: { id: resToAlloc.id },
            data: { status: 'running' }
          });
          console.log(`Allocated resource ${resToAlloc.name} to project ${project.name}`);
        }
      }

      // Generate a mock bill
      await prisma.bill.create({
        data: {
          userId: user.id,
          totalAmount: Math.floor(Math.random() * 500) + 100,
          taxes: 18.5,
          billingMonth: '2026-08',
          status: index % 3 === 0 ? 'paid' : 'pending'
        }
      });
    }
  }

  console.log("Seeding complete!");
}

seed()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
