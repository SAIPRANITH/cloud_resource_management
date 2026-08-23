const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getBills = async (req, res) => {
  try {
    const isAdmin = req.user.roles && req.user.roles.includes('Admin');
    const filter = isAdmin ? {} : { userId: req.user.id };

    const bills = await prisma.bill.findMany({
      where: filter,
      include: {
        billItems: true,
        user: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Generates a bill for the requesting user (or a specified userId for admins).
 * Cost is computed from each allocation's duration: cost = resource.baseCost * days / 30
 * Only includes allocations that have been terminated (have an endDate).
 * Also includes any active allocations and bills them up to now.
 */
const generateBill = async (req, res) => {
  try {
    // Allow self-billing or admin billing anyone
    const isAdmin = req.user.roles && req.user.roles.includes('Admin');
    const targetUserId = (isAdmin && req.body.userId) ? req.body.userId : req.user.id;

    // Gather all projects for this user
    const userProjects = await prisma.project.findMany({
      where: { userId: targetUserId },
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
        const hours = Math.max((end - start) / (1000 * 60 * 60), 1); // at least 1 hour
        const days = hours / 24;
        // Per day cost = baseCost / 30 (monthly → daily)
        const cost = parseFloat(((alloc.resource.baseCost / 30) * days).toFixed(2));
        totalResourceCost += cost;
        items.push({
          description: `[${proj.name}] ${alloc.resource.name} (${alloc.resource.type}) — ${days.toFixed(1)} days @ ₹${(alloc.resource.baseCost / 30).toFixed(2)}/day`,
          amount: cost
        });
      });
    });

    if (items.length === 0) {
      return res.status(400).json({ message: 'No resources allocated. Nothing to bill.' });
    }

    const taxes = parseFloat((totalResourceCost * 0.18).toFixed(2)); // 18% GST
    const finalAmount = parseFloat((totalResourceCost + taxes).toFixed(2));

    const newBill = await prisma.bill.create({
      data: {
        userId: targetUserId,
        totalAmount: finalAmount,
        taxes,
        billingMonth: new Date().toISOString().substring(0, 7),
        billItems: {
          create: items
        }
      },
      include: { billItems: true }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'generate_bill',
        module: 'Billing',
        details: `Generated bill ${newBill.id} for user ${targetUserId} — ₹${finalAmount}`
      }
    });

    res.status(201).json(newBill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const payBill = async (req, res) => {
  try {
    const { billId, method } = req.body;

    const bill = await prisma.bill.findUnique({ where: { id: billId } });
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    if (bill.userId !== req.user.id) return res.status(401).json({ message: 'Unauthorized' });
    if (bill.status === 'paid') return res.status(400).json({ message: 'Bill already paid' });

    const payment = await prisma.payment.create({
      data: {
        billId,
        userId: req.user.id,
        amount: bill.totalAmount,
        method: method || 'Online',
        transactionReference: `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      }
    });

    await prisma.bill.update({
      where: { id: billId },
      data: { status: 'paid' }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'pay_bill',
        module: 'Payment',
        details: `Paid bill ${billId} via ${method || 'Online'} — ₹${bill.totalAmount}`
      }
    });

    res.json({ message: 'Payment successful', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getBills, generateBill, payBill };
