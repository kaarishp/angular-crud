import { Component } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EmployeeService } from "../network/employee.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
  });

  errorMessage!: string;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  async login() {
    // Ensure username and password are treated as strings, defaulting to empty strings if null or undefined
    const username = this.loginForm.get('username')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';
  
    // Check if both username and password are provided
    if (username && password) {
      // Call the login method from your service, passing the username and password
      this.employeeService.login(username, password).subscribe({
        next: (response) => {
          // Handle successful login here, such as redirecting the user or storing authentication tokens
          console.log('Login successful:', response);
          // Example redirection after successful login
          this.router.navigate(["/homepage"]);
        },
        error: (error) => {
          // Handle any errors that occur during the login process
          this.errorMessage = 'Login failed. Please check your credentials and try again.';
          console.error('Login error:', error);
        }
      });
    } else {
      // If either username or password is missing, set an error message to inform the user
      this.errorMessage = 'Both username and password are required.';
    }
  }
  
  
  goToSignUp(event: Event) {
    event.preventDefault();
    this.employeeService.goToSignup();
  }
}
