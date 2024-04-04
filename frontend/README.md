# Angular Employee Management App

An Angular application that demonstrates a complete Create, Read, Update, and Delete (CRUD) functionality, with a focus on managing employee data. The application features user authentication, data binding, use of services, custom pipes, routing, and integration with a backend using Apollo and GraphQL.

## Features

- **User Authentication**: Secure registration and login functionality.
- **CRUD Operations**: Allows for adding, updating, viewing, and deleting employee details.
- **Data Binding**: Implements two-way data binding for responsive forms.
- **Services**: Utilizes Angular services to handle data operations and business logic.
- **Pipes**: Uses custom pipes for transforming displayed values.
- **Routing**: Manages navigation between different components with Angular Router.
- **Apollo Client**: Integrates with GraphQL API using Apollo client for Angular.
- **Responsive Design**: Adapts to different screen sizes for a consistent user experience.

## Pages Overview

- **Register Page**: A form to sign up new users with username, email, and password fields.
- **Login Page**: A login form for existing users to access their accounts.
- **Employee List Page**: Displays a list of all employees with options to view, update, or delete each one.
- **Add Employee Page**: Contains a form to input details of a new employee, including first name, last name, email, gender, and salary.
- **Update Employee Details Page**: A pre-filled form that allows editing details of an existing employee.
- **View Employee Details Page**: Shows all details of an employee in a read-only format.

## How to Run

1. Clone the repository to your local machine.
2. Install the required node modules with `npm install`.
3. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.
4. The app will automatically reload if you change any of the source files.

## Additional Information

To work with the GraphQL backend, make sure to set up your Apollo client in the `graphql.module.ts` file, providing the appropriate GraphQL server URI. Use GraphQL queries and mutations to interact with your backend.

## Contributing

Contributions are welcome. Please read the CONTRIBUTING.md file for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.