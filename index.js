require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

const userTypeDefs = require('./typeDefs/userTypeDefs');
const employeeTypeDefs = require('./typeDefs/employeeTypeDefs');
const userResolvers = require('./resolvers/userResolvers');
const employeeResolvers = require('./resolvers/employeeResolvers');

const app = express();
app.use(express.json());

const server = new ApolloServer({
  typeDefs: [userTypeDefs, employeeTypeDefs],
  resolvers: [userResolvers, employeeResolvers],
});

async function startServer() {
  try {
    await server.start();
    server.applyMiddleware({ app });

    // Build MongoDB Atlas connection string from .env
    const mongoURI = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.${process.env.CLUSTER_ID}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Atlas connected');

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('❌ Server failed to start:', error);
  }
}

startServer();