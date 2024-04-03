const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const dotenv = require('dotenv');

dotenv.config();

// MongoDB connection
const DB_CONNECTION_STRING = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Success Mongodb connection');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// GraphQL Schema Definitions
const typeDefs = gql`
type Employee {
  id: ID!
  firstname: String!
  lastname: String!
  email: String!
  gender: String!
  salary: Float!
  message: String
  error: String
}
type User {
  username: String!
  email: String!
  password: String!
  message: String
  error: String
}

type Query {
  login(username: String!, password: String!): String
  getEmployees: [Employee]
  getEmployeeByID(id: ID!): Employee
}

type Mutation {
  addEmployee(firstname: String!
      lastname: String!
      email: String!
      gender: String!
      salary: Float!): Employee

  updateEmployee(id: String!
      firstname: String!
      lastname: String!
      email: String!
      gender: String!
      salary: Float!): Employee

  deleteEmployee(id: String!): Employee

  signup(username: String!, 
      email: String!, 
      password: String!): User
}
`;

// Resolvers
const resolvers = {
    Query: {
      getEmployees: async () => {
          return await EmployeeModel.find({});
      },
      getEmployeeByID: async (_, args) => {
          try {
              return await EmployeeModel.findById(args.id);
          } catch (err) {
              if (!args.id) {
                  throw new Error('Please provide an ID.');
              } else if (err.name === 'CastError') {
                  throw new Error('The provided ID is not valid.');
              }
              throw new Error('There was a problem retrieving the employee details.');
          }
      },
      login: async (_, args) => {
          try {
              const user = await UserModel.findOne({ username: args.username });
  
              if (user && user.password === args.password) {
                  return `User ${user.username} logged in successfully.`;
              } else {
                  return 'Incorrect username or password. Please try again.';
              }
          } catch (err) {
              return `Error logging in: ${err.message}`;
          }
      }
    },
    Mutation: {
      addEmployee: async (_, args) => {
          try {
              const newEmployee = new EmployeeModel({
                  firstname: args.firstname,
                  lastname: args.lastname,
                  email: args.email,
                  gender: args.gender,
                  salary: args.salary,
              });
              return await newEmployee.save();
          } catch (err) {
              if (!args.firstname || !args.lastname || !args.email || !args.gender || !args.salary) {
                  throw new Error('Please ensure all required fields are completed.');
              }
              if (err.code === 11000) {
                  const field = Object.keys(err.keyPattern)[0];
                  throw new Error(`An employee with that ${field} already exists.`);
              } else if (err.name === 'ValidationError') {
                  if (err.errors.salary) {
                      throw new Error('The salary must be a positive number.');
                  }
                  throw new Error('Please enter a valid email address.');
              } else {
                  throw new Error('Unable to add the employee due to an error.');
              }
          }
      },
      updateEmployee: async (_, args) => {
          if (!args.firstname || !args.lastname || !args.email || !args.gender || !args.salary) {
              throw new Error('All fields are required for updating an employee.');
          }
          try {
              return await EmployeeModel.findOneAndUpdate(
                  { _id: args.id },
                  { 
                      $set: { 
                          firstname: args.firstname, 
                          lastname: args.lastname, 
                          email: args.email, 
                          gender: args.gender, 
                          salary: args.salary 
                      } 
                  },
                  { new: true }
              );
          } catch (err) {
              if (!args.id || err.name === 'CastError') {
                  throw new Error('No matching employee found for the provided ID.');
              }
              if (err.code === 11000) {
                  const field = Object.keys(err.keyPattern)[0];
                  throw new Error(`An employee with that ${field} already exists. Please use a different ${field}.`);
              } else {
                  throw new Error('An error occurred during the employee update process.');
              }
          }
      },
      deleteEmployee: async (_, args) => {
          if (!args.id) {
              throw new Error('An ID is required to delete an employee.');
          }
          try {
              return await EmployeeModel.findByIdAndDelete(args.id);
          } catch (err) {
              if (err.name === 'CastError') {
                  throw new Error('The ID provided for deletion is invalid.');
              }
              throw new Error('An error occurred during the deletion process.');
          }
      },
      signup: async (_, args) => {
          try {
              const newUser = new UserModel({
                  username: args.username,
                  email: args.email,
                  password: args.password
              });
              return await newUser.save();
          } catch (err) {
              if (!args.username || !args.email || !args.password) {
                  throw new Error('Username, email, and password are required fields.');
              } else if (err.code === 11000) {
                  const field = Object.keys(err.keyPattern)[0];
                  throw new Error(`A user with that ${field} already exists. Please choose another.`);
              } else if (err.name === 'ValidationError') {
                  throw new Error('The email address format is invalid.');
              } else {
                  throw new Error('We encountered an error during the signup process.');
              }
          }
      }
    }
};
  

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Express Server
const app = express();
app.use(bodyParser.json());
app.use('*', cors());

async function startServer() {
  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: process.env.PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();
