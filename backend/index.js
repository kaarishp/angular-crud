require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloServer, gql } = require('apollo-server-express');
const dotenv = require('dotenv');

const EmployeeModel = require('./models/Employee');
const UserModel = require('./models/User'); 

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
type SignUpResponse {
    message: String!
    user: User
}
type LoginResponse {
    message: String
    user: User,
}
type User {
  id: ID!
  username: String!
  email: String!
  password: String!
}
input UserInput {
    username: String!
    email: String!
    password: String!
}
type Query {
    login(username: String!, password: String!): LoginResponse
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

  signup(user: UserInput!): SignUpResponse
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
                  throw new Error('Enter an ID.');
              } else if (err.name === 'CastError') {
                  throw new Error('ID is not valid.');
              }
              throw new Error('Error employee details.');
          }
      },
      login: async (_, { username, password }) => {
        try {
            const user = await UserModel.findOne({ username });
    
            if (!user) {
                throw new Error("User not found");
            }
    
            const passwordMatch = await bcrypt.compare(password, user.password);
    
            if (!passwordMatch) {
                throw new Error("Invalid password");
            }
    
            const token = jwt.sign(
              { userId: user.id, email: user.email },
              process.env.JWT_SECRET, 
              { expiresIn: '1h' } 
            );
    
            return { message: "Login successful", user, token };
        } catch (error) {
            throw new Error(error.message || "An error occurred during login.");
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
                  throw new Error('Please ensure all required fields are included.');
              }
              if (err.code === 11000) {
                  const field = Object.keys(err.keyPattern)[0];
                  throw new Error(`An employee with that ${field} already exists.`);
              } else if (err.name === 'ValidationError') {
                  if (err.errors.salary) {
                      throw new Error('Must be more than 0');
                  }
                  throw new Error('Please enter a valid email address.');
              } else {
                  throw new Error('Add Employee Error.');
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
                  throw new Error('Employee update error');
              }
          }
      },
      deleteEmployee: async (_, args) => {
          if (!args.id) {
              throw new Error('ID is required to delete an employee.');
          }
          try {
              return await EmployeeModel.findByIdAndDelete(args.id);
          } catch (err) {
              if (err.name === 'CastError') {
                  throw new Error('The ID provided for deletion is invalid.');
              }
              throw new Error('Deletion Error');
          }
      },
      signup: async (_, { user }) => {
        const { username, password, email } = user;
        if (!username || !password) {
            throw new Error('Username and password are required');
        }

        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({ username, email, password: hashedPassword });
        await newUser.save();

        return { 
            message: 'User account created successfully',
            user: newUser
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

  app.listen(4000, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();
