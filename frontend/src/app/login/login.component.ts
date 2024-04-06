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
    const simulatedResponse = { token: "fake-jwt-token", user: { id: 1, username: "user" } };
  
    console.log('Login successful:', simulatedResponse);
    this.router.navigate(["/homepage"]);
  }
  

  goToSignUp(event: Event) {
    event.preventDefault();
    this.employeeService.goToSignup();
  }
}