import { Component, OnInit } from "@angular/core";
import { Employee } from "../models/employee";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { EmployeeService } from "../network/employee.service";

@Component({
  selector: "app-employees",
  templateUrl: "./view-employees.component.html",
  styleUrls: ["./view-employees.component.css"],
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  showDialog = false;
  showDeleteDialog = false;


  constructor(
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.getEmployees(); 
  }

  getEmployees() {
    this.employeeService.getEmployees().subscribe(({ data }) => {
      this.employees = (data as any).getEmployees;
    });
  }

  deleteEmployee() {
    if (!this.selectedEmployee) return;
    this.employeeService
      .deleteEmployee(this.selectedEmployee.id)
      .subscribe(() => {
        this.employees = this.employees.filter(
          (employee) => employee.id !== this.selectedEmployee!.id
        );
        this.showDeleteDialog = false;
      });
  }

  goToLogin(event: Event) {
    event.preventDefault();
    this.employeeService.goToLogin();
  }

  goToAddEmployee(event: Event) {
    event.preventDefault();
    this.employeeService.goToAddEmployee();
  }

  goToViewEmployee(event: Event) {
    event.preventDefault();
    this.employeeService.goToViewEmployee();
  }

  goToDeleteEmployee(event: Event) {
    event.preventDefault();
    this.employeeService.goToDeleteEmployee();
  }

  goToUpdate(event: Event, employee: Employee) {
    this.employeeService.setIsViewMode(false); 
    this.employeeService.goToUpdateEmployee(employee);
    event.preventDefault();
  }

  gotoDeleteEmployee(event: Event) {
    event.preventDefault();
    this.router.navigate(["/update-employee"]);
  }

  goToViewOneEmployee(event: Event, employee: Employee) {
    this.employeeService.setIsViewMode(true); 
    this.employeeService.goToUpdateEmployee(employee);
    event.preventDefault();
    this.router.navigate(["/update-employee"]);
  }

}
