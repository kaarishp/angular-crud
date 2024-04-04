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
    const { username, password } = this.loginForm.value;
    if (
      !username ||
      typeof username !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      this.errorMessage = "Enter Username & Passowrd";
      return;
    }

    await this.employeeService
      .login(username, password)
      .subscribe((result: any) => {
        if (result.data.login === "Incorrect username or password") {
          this.errorMessage = "Incorrect username or password";
        } else {
          this.router.navigate(["/homepage"]);
        }
      });
  }

  goToSignUp(event: Event) {
    event.preventDefault();
    this.employeeService.goToSignup();
  }
}
