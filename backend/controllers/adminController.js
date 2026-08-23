const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Admin: Get all users with their resource usage and billing info
 */
const getAllUsersStats = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        userRoles: { include: { role: true } },
        projects: {
          include: {
            resourceAllocations: {
              include: { resource: true }
            }
          }
        },
        bills: {
          include: { billItems: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const result = users.map(user => {
      const roles = user.userRoles.map(ur => ur.role.name);
      let totalAllocations = 0;
      let activeAllocations = 0;
      let totalResourceCost = 0;

      user.projects.forEach(proj => {
        proj.resourceAllocations.forEach(alloc => {
          totalAllocations++;
          if (alloc.status === 'active') activeAllocations++;
          // Calculate cost for this allocation
          const start = new Date(alloc.startDate);
          const end = alloc.endDate ? new Date(alloc.endDate) : new Date();
          const days = Math.max((end - start) / (1000 * 60 * 60 * 24), 1 / 24);
          totalResourceCost += (alloc.resource.baseCost / 30) * days;
        });
      });

      const totalBilled = user.bills.reduce((sum, b) => sum + b.totalAmount, 0);
      const totalPaid = user.bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.totalAmount, 0);
      const totalPending = user.bills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.totalAmount, 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
        createdAt: user.createdAt,
        projectCount: user.projects.length,
        totalAllocations,
        activeAllocations,
        estimatedCost: parseFloat(totalResourceCost.toFixed(2)),
        totalBilled: parseFloat(totalBilled.toFixed(2)),
        totalPaid: parseFloat(totalPaid.toFixed(2)),
        totalPending: parseFloat(totalPending.toFixed(2)),
        invoiceCount: user.bills.length
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Admin: Get platform-wide summary stats
 */
const getPlatformStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProjects,
      totalResources,
      activeAllocations,
      allBills
    ] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.resource.count(),
      prisma.resourceAllocation.count({ where: { status: 'active' } }),
      prisma.bill.findMany({ include: { billItems: true } })
    ]);

    const totalRevenue = allBills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingRevenue = allBills.filter(b => b.status === 'pending').reduce((sum, b) => sum + b.totalAmount, 0);
    const totalInvoices = allBills.length;

    // Resource type breakdown
    const resourceBreakdown = await prisma.resource.groupBy({
      by: ['type'],
      _count: { _all: true }
    });

    // Recent registrations (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const newUsers = await prisma.user.count({ where: { createdAt: { gte: last7Days } } });

    res.json({
      totalUsers,
      totalProjects,
      totalResources,
      activeAllocations,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      pendingRevenue: parseFloat(pendingRevenue.toFixed(2)),
      totalInvoices,
      newUsersLast7Days: newUsers,
      resourceBreakdown: resourceBreakdown.map(r => ({ type: r.type, count: r._count._all }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Admin: Generate a bill for any user
 */
const adminGenerateBill = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const userProjects = await prisma.project.findMany({
      where: { userId },
      include: {
        resourceAllocations: {
          include: { resource: true }
        }
      }
    });

    let totalResourceCost = 0;
    const items = [];

    userProjects.forEach(proj => {
      proj.resourceAllocations.forEach(alloc => {
        const start = new Date(alloc.startDate);
        const end = alloc.endDate ? new Date(alloc.endDate) : new Date();
        const hours = Math.max((end - start) / (1000 * 60 * 60), 1);
        const days = hours / 24;
        const cost = parseFloat(((alloc.resource.baseCost / 30) * days).toFixed(2));
        totalResourceCost += cost;
        items.push({
          description: `[${proj.name}] ${alloc.resource.name} (${alloc.resource.type}) — ${days.toFixed(1)} days`,
          amount: cost
        });
      });
    });

    if (items.length === 0) {
      return res.status(400).json({ message: 'No resources allocated for this user.' });
    }

    const taxes = parseFloat((totalResourceCost * 0.18).toFixed(2));
    const finalAmount = parseFloat((totalResourceCost + taxes).toFixed(2));

    const newBill = await prisma.bill.create({
      data: {
        userId,
        totalAmount: finalAmount,
        taxes,
        billingMonth: new Date().toISOString().substring(0, 7),
        billItems: { create: items }
      },
      include: { billItems: true }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'admin_generate_bill',
        module: 'Billing',
        details: `Admin generated bill for user ${userId} — ₹${finalAmount}`
      }
    });

    res.status(201).json(newBill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getAllUsersStats, getPlatformStats, adminGenerateBill };
