const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getDashboardData = async (req, res) => {
  try {
    const isClient = req.user.roles && !req.user.roles.includes('Admin');
    
    // Summary logic
    const totalUsers = isClient ? 1 : await prisma.user.count();
    
    const projectsFilter = isClient ? { userId: req.user.id } : {};
    const totalProjects = await prisma.project.count({ where: projectsFilter });

    const allocationsFilter = isClient ? { project: { userId: req.user.id } } : {};
    const runningResources = await prisma.resourceAllocation.count({
      where: { ...allocationsFilter, status: 'active', resource: { status: 'running' } }
    });

    const billsFilter = isClient ? { userId: req.user.id } : {};
    const bills = await prisma.bill.findMany({ where: billsFilter });
    
    const pendingBillsCount = bills.filter(b => b.status === 'pending').length;
    const monthlyRevenue = bills.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.totalAmount, 0);

    const activeAlerts = await prisma.alert.count({ where: { status: 'unread' } });

    const alertsData = await prisma.alert.findMany({
      where: { status: 'unread' },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    // Mock CPU/RAM data
    const metrics = [
      { name: '00:00', cpu: 20, ram: 40 },
      { name: '04:00', cpu: 25, ram: 45 },
      { name: '08:00', cpu: 55, ram: 70 },
      { name: '12:00', cpu: 85, ram: 90 },
      { name: '16:00', cpu: 65, ram: 60 },
      { name: '20:00', cpu: 30, ram: 45 },
    ];

    // Predict future usage
    const predictions = metrics.map((m, i) => ({
      name: `+${(i+1)*4}h`,
      predictedCpu: Math.min(100, m.cpu + Math.floor(Math.random() * 20 - 5)),
      predictedRam: Math.min(100, m.ram + Math.floor(Math.random() * 15 - 5)),
    }));

    res.json({
      summary: {
        totalUsers,
        totalProjects,
        runningResources,
        pendingBills: pendingBillsCount,
        monthlyRevenue,
        activeAlerts,
      },
      metrics,
      alerts: alertsData,
      predictions
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getDashboardData };
