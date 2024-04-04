import { Component } from "@angular/core";
import { EmployeeService } from "../network/employee.service";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-update-employee",
  templateUrl: "./update-employee.component.html",
  styleUrls: ["./update-employee.component.css"],
})
export class UpdateEmployeeComponent {
  employee: any = {};
  errorMessage!: String;
  successMessage!: String;
  employeeForm!: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private apollo: Apollo,
    private router: Router
  ) {}

  ngOnInit() {
    this.employee = this.employeeService.getSelectedEmployee();

    this.employeeForm = new FormGroup({
      firstname: new FormControl(this.employee.firstname, Validators.required),
      lastname: new FormControl(this.employee.lastname, Validators.required),
      email: new FormControl(this.employee.email, [
        Validators.required,
        Validators.email,
      ]),
      gender: new FormControl(this.employee.gender, Validators.required),
      salary: new FormControl(this.employee.salary, Validators.required),
    });
  }
  async updateEmployee() {
    const { firstname, lastname, email, gender, salary } =
      this.employeeForm.value;

    if (!email || !this.employeeForm.controls["email"].valid) {
      this.errorMessage = "Please enter a valid email address.";
      return;
    }

    await this.employeeService
      .updateEmployee(
        this.employeeService.getSelectedEmployee()?.id || "",
        firstname,
        lastname,
        email,
        gender,
        salary
      )
      .subscribe(
        () => {
          this.errorMessage = "";
          this.successMessage = "Employee updated successfully!";
          setTimeout(() => {
            this.router.navigate(["/homepage"]);
          });
        },
        (error) => {
          if (!salary || !firstname || !lastname || !email) {
            this.errorMessage = "All fields are required";
          } else {
            this.errorMessage = error.message;
          }
        }
      );
  }

  isViewMode(): boolean {
    return this.employeeService.getIsViewMode();
  }

  goToHomePage(event: Event) {
    this.employeeService.goToHomePage();
  }
}
