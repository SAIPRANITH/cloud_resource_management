const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── 1. Roles ───────────────────────────────────────────────
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', description: 'Administrator with full platform access' }
  });
  const customerRole = await prisma.role.upsert({
    where: { name: 'Customer' },
    update: {},
    create: { name: 'Customer', description: 'Standard cloud resource consumer' }
  });

  // ─── 2. Pricing Plans (findFirst to avoid duplicates) ───────
  const plans = [
    { name: 'Starter',      monthlyCost: 9.99,   description: 'Ideal for individuals and small projects',       features: '5 VMs, 50GB Storage, Community Support' },
    { name: 'Professional', monthlyCost: 49.99,  description: 'Built for growing teams and production workloads', features: '50 VMs, 500GB Storage, Priority Support, Analytics' },
    { name: 'Enterprise',   monthlyCost: 199.99, description: 'Unlimited scale for enterprise operations',       features: 'Unlimited VMs, 10TB Storage, 24/7 Support, SLA' },
  ];
  for (const p of plans) {
    const existing = await prisma.pricingPlan.findFirst({ where: { name: p.name } });
    if (!existing) await prisma.pricingPlan.create({ data: p });
  }

  // ─── 3. Admin User ──────────────────────────────────────────
  const password = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cloud.local' },
    update: { password },
    create: {
      name: 'Admin User',
      email: 'admin@cloud.local',
      password,
      userRoles: { create: { roleId: adminRole.id } }
    }
  });

  // ─── 4. Demo Customer ───────────────────────────────────────
  await prisma.user.upsert({
    where: { email: 'demo@cloud.local' },
    update: { password },
    create: {
      name: 'Demo Customer',
      email: 'demo@cloud.local',
      password,
      userRoles: { create: { roleId: customerRole.id } }
    }
  });

  // ─── 5. Available Resource Pool ─────────────────────────────
  //  All resources start with status: 'available' so users can allocate them

  const resourcePool = [
    // Virtual Machines
    { name: 'micro-vm-us-east',   type: 'VM',       cpu: 1,  ram: 1,    disk: 20,   region: 'us-east-1',    baseCost: 5.00 },
    { name: 'small-vm-us-east',   type: 'VM',       cpu: 2,  ram: 4,    disk: 40,   region: 'us-east-1',    baseCost: 12.00 },
    { name: 'medium-vm-us-east',  type: 'VM',       cpu: 4,  ram: 8,    disk: 80,   region: 'us-east-1',    baseCost: 25.00 },
    { name: 'large-vm-us-east',   type: 'VM',       cpu: 8,  ram: 16,   disk: 160,  region: 'us-east-1',    baseCost: 50.00 },
    { name: 'xlarge-vm-eu-west',  type: 'VM',       cpu: 16, ram: 32,   disk: 320,  region: 'eu-west-1',    baseCost: 100.00 },
    { name: 'compute-vm-ap-south',type: 'VM',       cpu: 4,  ram: 16,   disk: 100,  region: 'ap-south-1',   baseCost: 35.00 },
    { name: 'gpu-vm-us-west',     type: 'VM',       cpu: 8,  ram: 32,   disk: 200,  region: 'us-west-2',    baseCost: 120.00 },

    // Databases
    { name: 'postgres-small',     type: 'Database', cpu: 2,  ram: 4,    disk: 100,  region: 'us-east-1',    baseCost: 30.00 },
    { name: 'postgres-medium',    type: 'Database', cpu: 4,  ram: 8,    disk: 250,  region: 'us-east-1',    baseCost: 65.00 },
    { name: 'mysql-standard',     type: 'Database', cpu: 2,  ram: 4,    disk: 200,  region: 'eu-west-1',    baseCost: 40.00 },
    { name: 'mongodb-cluster',    type: 'Database', cpu: 8,  ram: 32,   disk: 500,  region: 'us-west-2',    baseCost: 150.00 },
    { name: 'redis-cache',        type: 'Database', cpu: 2,  ram: 8,    disk: 50,   region: 'ap-south-1',   baseCost: 20.00 },

    // Storage
    { name: 'object-store-100gb', type: 'Storage',  cpu: null, ram: null, disk: 100,  region: 'us-east-1',  baseCost: 2.30 },
    { name: 'object-store-500gb', type: 'Storage',  cpu: null, ram: null, disk: 500,  region: 'us-east-1',  baseCost: 11.50 },
    { name: 'block-store-1tb',    type: 'Storage',  cpu: null, ram: null, disk: 1000, region: 'eu-west-1',  baseCost: 40.00 },
    { name: 'archive-store-5tb',  type: 'Storage',  cpu: null, ram: null, disk: 5000, region: 'us-west-2',  baseCost: 95.00 },

    // Load Balancers / Networking
    { name: 'lb-standard-us',     type: 'LoadBalancer', cpu: null, ram: null, disk: null, region: 'us-east-1', baseCost: 18.00 },
    { name: 'lb-premium-eu',      type: 'LoadBalancer', cpu: null, ram: null, disk: null, region: 'eu-west-1', baseCost: 35.00 },
    { name: 'cdn-global',         type: 'LoadBalancer', cpu: null, ram: null, disk: null, region: 'global',     baseCost: 50.00 },
  ];

  for (const r of resourcePool) {
    // Use upsert with name so re-running seed doesn't duplicate
    const existing = await prisma.resource.findFirst({ where: { name: r.name } });
    if (!existing) {
      await prisma.resource.create({
        data: { ...r, status: 'available' }
      });
      console.log(`  ✅ Resource created: ${r.name}`);
    } else {
      console.log(`  ⏩ Resource exists: ${r.name}`);
    }
  }

  console.log('\n✅ Database seeding complete!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin    → admin@cloud.local   / password123');
  console.log('   Customer → demo@cloud.local    / password123');
}

main()
  .catch(e => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
