const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      include: {
        resourceAllocations: {
          include: { resource: true }
        }
      }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId: req.user.id
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'create_project',
        module: 'Project',
        details: `Project ${name} created`
      }
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    // Verify ownership
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
       return res.status(401).json({ message: 'Not authorized' });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: { name, description, status }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify ownership
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
       return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete allocations first
    await prisma.resourceAllocation.deleteMany({ where: { projectId: id } });
    await prisma.project.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'delete_project',
        module: 'Project',
        details: `Project ${id} deleted`
      }
    });

    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
