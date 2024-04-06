import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { EmployeesComponent } from "./view-employees/view-employees.component";
import { AddEmployeeComponent } from "./add-employee/add-employee.component";
import { UpdateEmployeeComponent } from "./update-employee/update-employee.component";


const routes: Routes = [
  { path: "", component: LoginComponent }, 
  { path: "signup", component: SignupComponent }, 
  { path: "homepage", component: EmployeesComponent }, 
  { path: "new-employee", component: AddEmployeeComponent }, 
  { path: "update-employee", component: UpdateEmployeeComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
