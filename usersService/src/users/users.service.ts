import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/user-create.dto";
import { InjectModel } from "@nestjs/mongoose";
import {Model} from "mongoose"
import { User } from "./schemas/users.schema";
import * as bcrypt from 'bcrypt';
import { SafeTransferUserDto } from "./dto/user-safetransfer.dto";

// uses dependency injection
@Injectable()
export class UsersService{
  
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ){}

  async userExists(username: string): Promise<string>{
    if(this.isUsernameRegistered(username)) return `user: ${username} exists.`;

    return `user: ${username} doesn't exist.`;
  }

  async getAllUsers(): Promise<SafeTransferUserDto[]>{
    
    const excludedResponse: SafeTransferUserDto[] = await this.userModel.find({}).select('-password');

    let shareableResp: SafeTransferUserDto[] = new Array<SafeTransferUserDto>();
    let temp: SafeTransferUserDto = new SafeTransferUserDto;
    excludedResponse.forEach((usr)=>{
      temp.username = usr.username;
      temp.name = usr.name;
      temp.email = usr.email;

      shareableResp.push(temp); 
    });

    return shareableResp;
  }

  async countAll(): Promise<number>{
    return (await this.userModel.find({})).length;
  }

  async addNewUser(user: CreateUserDto): Promise<any>{

    const {name, username, email, pass} = user;

    // validating username
    if(await this.isUsernameRegistered(username)){
      return "username already taken";
    }
    // validating email
    if(await this.isEmailRegistered(email)){
      return "email already registered";
    }

    try{
      const hashedPass = await bcrypt.hash(pass, Number(process.env.HASHING_SALT_ROUNDS));
      const newUser = await this.userModel.create({
        name,
        username,
        email,
        pass: hashedPass,
      });
      await newUser.save();
    }
    catch(error){
      return(error);
    }

    return "user added successfully";
  }

  async isUsernameRegistered(username_: string): Promise<boolean>{
    const res = await this.userModel.findOne({username: username_});
    // console.log(res);
    if(res){
      // console.log(res);

      console.log("username already taken");
      return true;
    }
    return false;
  }

  async isEmailRegistered(email_: string): Promise<boolean>{
    const res = await this.userModel.findOne({email: email_});
    if(res){
      console.log("email is already registered");
      return true;
    }
    return false;
  }
}