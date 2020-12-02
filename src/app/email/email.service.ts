import { Service } from "typedi";


@Service()
export class EmailService{

    constructor(
      ) {}

    public sendEmail(email:string):void{
        if(email !== undefined && email !== null)
            console.log("An email has been sent to: ", email);
        else
            console.log("The email is not valid");
    }

}