const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id, roles) => {
  return jwt.sign({ id, roles }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const customerRole = await prisma.role.upsert({
      where: { name: 'Customer' },
      update: {},
      create: { name: 'Customer', description: 'Standard cloud resource consumer' }
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userRoles: {
          create: { roleId: customerRole.id }
        }
      },
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id, ['Customer']),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const roles = user.userRoles.map(ur => ur.role.name);
      const token = generateToken(user.id, roles);
      
      // Store session
      await prisma.session.create({
        data: {
          userId: user.id,
          token: token,
          device: req.headers['user-agent'] || 'unknown',
        }
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'login',
          module: 'Auth',
          details: 'User logged in successfully'
        }
      });

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const logoutUser = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            await prisma.session.update({
                where: { token },
                data: { logoutTime: new Date() }
            });
        } catch (error) {
            console.error('Session update failed or not found', error);
        }
    }
    res.json({ message: 'Logged out successfully' });
};

module.exports = { registerUser, loginUser, logoutUser };
