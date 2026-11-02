const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getResources = async (req, res) => {
  try {
    const resources = await prisma.resource.findMany({
      include: {
        resourceAllocations: {
          where: { status: 'active' },
          include: { project: { select: { name: true } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createResource = async (req, res) => {
  try {
    const { name, type, cpu, ram, disk, region, baseCost } = req.body;
    if (!name || !type || !region || baseCost === undefined) {
      return res.status(400).json({ message: 'name, type, region and baseCost are required' });
    }
    const parsedCost = parseFloat(baseCost);
    if (isNaN(parsedCost) || parsedCost < 0) {
      return res.status(400).json({ message: 'baseCost must be a valid non-negative number' });
    }
    const resource = await prisma.resource.create({
      data: {
        name,
        type,
        cpu: cpu ? parseInt(cpu) : null,
        ram: ram ? parseInt(ram) : null,
        disk: disk ? parseInt(disk) : null,
        region,
        baseCost: parsedCost,
        status: 'available'
      }
    });
    res.status(201).json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const allocateResource = async (req, res) => {
  try {
    const { resourceId, projectId } = req.body;
    if (!resourceId || !projectId) {
      return res.status(400).json({ message: 'resourceId and projectId are required' });
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project || project.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized for this project' });
    }

    // Check resource exists and is available
    const resource = await prisma.resource.findUnique({ where: { id: resourceId } });
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    if (resource.status === 'running') {
      return res.status(400).json({ message: 'Resource is already allocated to another project' });
    }

    // Check not already allocated to THIS project
    const existing = await prisma.resourceAllocation.findFirst({
      where: { projectId, resourceId, status: 'active' }
    });
    if (existing) return res.status(400).json({ message: 'Resource already allocated to this project' });

    const allocation = await prisma.resourceAllocation.create({
      data: { projectId, resourceId, startDate: new Date(), status: 'active' },
      include: { resource: true }
    });

    await prisma.resource.update({
      where: { id: resourceId },
      data: { status: 'running' }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'allocate_resource',
        module: 'Resource',
        details: `Resource ${resource.name} allocated to project "${project.name}"`
      }
    });

    res.status(201).json(allocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * Terminate (deallocate) a resource from a project.
 * Sets endDate on the allocation and marks resource as available again.
 */
const terminateAllocation = async (req, res) => {
  try {
    const { allocationId } = req.params;

    const allocation = await prisma.resourceAllocation.findUnique({
      where: { id: allocationId },
      include: { project: true, resource: true }
    });

    if (!allocation) return res.status(404).json({ message: 'Allocation not found' });
    if (allocation.project.userId !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    if (allocation.status === 'terminated') {
      return res.status(400).json({ message: 'Allocation already terminated' });
    }

    const updatedAllocation = await prisma.resourceAllocation.update({
      where: { id: allocationId },
      data: { status: 'terminated', endDate: new Date() }
    });

    // Mark resource as available again
    await prisma.resource.update({
      where: { id: allocation.resourceId },
      data: { status: 'available' }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'terminate_allocation',
        module: 'Resource',
        details: `Resource ${allocation.resource.name} deallocated from project "${allocation.project.name}"`
      }
    });

    res.json(updatedAllocation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.resourceAllocation.deleteMany({ where: { resourceId: id } });
    await prisma.resource.delete({ where: { id } });
    res.json({ message: 'Resource removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getResources, createResource, allocateResource, terminateAllocation, deleteResource };
