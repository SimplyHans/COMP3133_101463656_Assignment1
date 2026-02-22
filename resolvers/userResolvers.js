const User = require('../models/User'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userResolvers = {
  Query: {
    login: async (_, { username, password }) => {
      try {
        const user = await User.findOne({ username });
        if (!user) throw new Error('User not found');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid credentials');

        const token = jwt.sign(
          { id: user._id, username: user.username },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            password: user.password
          },
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) throw new Error('Email already in use');

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });

        const savedUser = await newUser.save();

        return {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          password: savedUser.password
        };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

module.exports = userResolvers;