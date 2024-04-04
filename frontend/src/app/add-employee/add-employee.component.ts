import { Component } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { EmployeeService } from "../network/employee.service";
@Component({
  selector: "app-add-employee",
  templateUrl: "./add-employee.component.html",
  styleUrls: ["./add-employee.component.css"],
})
export class AddEmployeeComponent {
  employeeForm = new FormGroup({
    firstname: new FormControl("", Validators.required),
    lastname: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    gender: new FormControl("", Validators.required),
    salary: new FormControl(null, Validators.required),
  });

  errorMessage!: String;
  successMessage!: String;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  async addEmployee() {
    const { firstname, lastname, email, gender } = this.employeeForm.value;
    const salary: number = this.employeeForm.value.salary || 0; // Ensure salary is always a number

    if (salary === null) {
      this.errorMessage = "Salary is required";
      return;
    }
    // Check if firstname is null or undefined
    if (!firstname || firstname === null || firstname === undefined) {
      this.errorMessage = "Firstname is required";
      return;
    }

    if (!lastname || lastname === null || lastname === undefined) {
      this.errorMessage = "lastname is required";
      return;
    }
    // add email
    if (!email || email === null || email === undefined) {
      this.errorMessage = "email is required";
      return;
    }

    // add gender
    if (!gender || gender === null) {
      this.errorMessage = "gender is required";
      return;
    }
    await this.employeeService
      .addEmployee(firstname, lastname, email, gender, salary)
      .subscribe(
        (result) => {
          this.employeeForm.reset();
          this.errorMessage = "";
          this.successMessage =
            "Employee created successfully!";
          this.router.navigate(["/homepage"]);
        },
        (error) => {
          this.errorMessage = error.message;
        }
      );
  }

  goToHomePage(event: Event) {
    this.employeeService.goToHomePage();
  }

  goHome() {
    this.router.navigate(['/homepage']); 
  }
  


}
