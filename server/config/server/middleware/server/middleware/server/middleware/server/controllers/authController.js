const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Agent = require('../models/Agent');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, department } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(400);
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role === 'AGENT' ? 'AGENT' : 'USER';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: assignedRole,
    });

    if (assignedRole === 'AGENT') {
      await Agent.create({
        userId: user._id,
        department: department || 'General Support',
      });
    }

    res.status(201).json({
      token: signToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      token: signToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

exports.getProfile = async (req, res) => {
  res.json(req.user);
};
