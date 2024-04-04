import { Component } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { EmployeeService } from "../network/employee.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
})
export class SignupComponent {
  signupForm = new FormGroup({
    username: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required),
  });

  errorMessage!: string;
  successMessage!: string;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  async signup() {
    const { username, email, password } = this.signupForm.value;

    if (
      !username ||
      typeof username !== "string" ||
      !email ||
      typeof email !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      this.errorMessage = "Invalid form data.";
      return;
    }

    if (!this.signupForm.controls["email"].valid) {
      this.errorMessage = "Please enter a valid email address.";
      return;
    }

    if (!this.signupForm.controls["password"].valid) {
      this.errorMessage = "Please enter a valid password.";
      return;
    }

    await this.employeeService.signup(username, email, password).subscribe(
      (result) => {
        this.signupForm.reset();
        this.errorMessage = "";
        this.successMessage =
          "Account created successfully!";
        setTimeout(() => {
          this.router.navigate(["/homepage"]);
        });
      },
      (error) => {
        this.errorMessage = error.message;
      }
    );
  }

  goToLogin(event: Event) {
    this.employeeService.goToLogin();
  }
}
