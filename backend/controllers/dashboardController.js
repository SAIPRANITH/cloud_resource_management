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

    // If client has no resources, they shouldn't have active alerts unless it's a specific notification
    let activeAlerts = 0;
    let alertsData = [];
    
    if (isClient) {
      // For clients, fetch their specific notifications instead of system-wide alerts
      activeAlerts = await prisma.notification.count({ where: { userId: req.user.id, status: 'unread' } });
      alertsData = await prisma.notification.findMany({
        where: { userId: req.user.id, status: 'unread' },
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
    } else {
      // Admins see system-wide alerts
      activeAlerts = await prisma.alert.count({ where: { status: 'unread' } });
      alertsData = await prisma.alert.findMany({
        where: { status: 'unread' },
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
    }

    // Dynamic CPU/RAM data based on running resources
    const timeLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    let metrics = [];
    let predictions = [];

    if (runningResources === 0) {
      // Flat graph if no resources
      metrics = timeLabels.map(name => ({ name, cpu: 0, ram: 0 }));
      predictions = metrics.map((m, i) => ({
        name: `+${(i+1)*4}h`,
        predictedCpu: 0,
        predictedRam: 0,
      }));
    } else {
      // Simulated usage based on number of running resources
      const baseCpu = Math.min(80, 10 + (runningResources * 5));
      const baseRam = Math.min(85, 20 + (runningResources * 8));
      
      metrics = timeLabels.map(name => ({
        name,
        cpu: Math.max(5, Math.min(100, baseCpu + Math.floor(Math.random() * 30 - 15))),
        ram: Math.max(10, Math.min(100, baseRam + Math.floor(Math.random() * 20 - 10)))
      }));

      // Predict future usage
      predictions = metrics.map((m, i) => ({
        name: `+${(i+1)*4}h`,
        predictedCpu: Math.max(5, Math.min(100, m.cpu + Math.floor(Math.random() * 10 - 5))),
        predictedRam: Math.max(10, Math.min(100, m.ram + Math.floor(Math.random() * 10 - 5))),
      }));
    }

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
    console.error("Dashboard error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getDashboardData };
