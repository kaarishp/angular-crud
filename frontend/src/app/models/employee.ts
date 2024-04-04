export class Employee {
    id: string; 
    firstname: string; 
    lastname: string; 
    email: string; 
    gender: string; 
    salary: number; 

    constructor(
      id: string,
      firstname: string,
      lastname: string,
      email: string,
      gender: string,
      salary: number
    ) {
      this.id = id;
      this.firstname = firstname;
      this.lastname = lastname;
      this.email = email;
      this.gender = gender;
      this.salary = salary;
    }
  }
  