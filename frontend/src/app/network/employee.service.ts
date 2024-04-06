import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Router } from "@angular/router";
import { Employee } from "../models/employee";
import { Observable } from 'rxjs';


@Injectable({
  providedIn: "root", 
})
export class EmployeeService {
  selectedEmployee_: any; 
  selectedEmployee: Employee | null = null;
  private isViewMode: boolean = false;

  setIsViewMode(viewMode: boolean) {
    this.isViewMode = viewMode;
  }

  getIsViewMode() {
    return this.isViewMode;
  }

  constructor(private apollo: Apollo, private router: Router) {}

  setSelectedEmployee(employee: any) {
    this.selectedEmployee_ = employee;
  }

  getEmployees() {
    return this.apollo.query({
      query: gql`
        query {
          getEmployees {
            id
            firstname
            lastname
            email
            gender
            salary
          }
        }
      `,
      fetchPolicy: "network-only",
    });
  }

  addEmployee(
    firstname: string,
    lastname: string,
    email: string,
    gender: string,
    salary: number
  ) {
    return this.apollo.mutate({
      mutation: gql`
        mutation {
          addEmployee(
            firstname: "${firstname}",
            lastname: "${lastname}",
            email: "${email}",
            gender: "${gender}",
            salary: ${salary}
          ) {
            id
            firstname
            lastname
            email
            gender
            salary
          }
        }
      `,
    });
  }

  updateEmployee(
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    gender: string,
    salary: number | null
  ) {
    const salaryQuery = salary ? `salary: ${salary}` : "";
    const mutationQuery = `
    mutation {
      updateEmployee(
        id: "${id}",
        firstname: "${firstname}",
        lastname: "${lastname}",
        email: "${email}",
        gender: "${gender}",
        ${salaryQuery}
      ) {
        id
        firstname
        lastname
        email
        gender
        salary
      }
    }
  `;
    return this.apollo.mutate({
      mutation: gql`
        ${mutationQuery}
      `,
    });
  }

  deleteEmployee(id: string) {
    return this.apollo.mutate({
      mutation: gql`
      mutation {
        deleteEmployee(id: "${id}") {
          id
        }
      }
    `,
      fetchPolicy: "network-only",
    });
  }

  signup(username: string, email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(user: {username: $username, email: $email, password: $password}) {
            message
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: {
        username,
        email,
        password
      }
    });
}


  login(username: string, password: string) {
    return this.apollo.query({
      query: gql`
        query {
          login(username: "${username}", password: "${password}")
        }
      `,
    });
  }
  

  goToLogin() {
    this.router.navigate(["/"]);
  }

  goToSignup() {
    this.router.navigate(["/signup"]);
  }

  goToAddEmployee() {
    this.router.navigate(["/new-employee"]);
  }

  goToViewEmployee() {
    this.router.navigate(["/view-employee"]);
  }

  goToDeleteEmployee() {
    this.router.navigate(["/delete-employee"]);
  }

  goToUpdateEmployee(employee: Employee) {
    this.selectedEmployee = employee;
    this.router.navigate(["/update-employee"]);
  }

  goToHomePage() {
    this.router.navigate(["/homepage"]);
  }

  getSelectedEmployee() {
    return this.selectedEmployee; 
  }
}
