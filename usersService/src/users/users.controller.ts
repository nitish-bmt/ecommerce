import { Body, Controller, ParseIntPipe, UsePipes, ValidationPipe } from "@nestjs/common";
import {Get, Post, Param} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/user-create.dto";
import { SafeTransferUserDto } from "./dto/user-safetransfer.dto";

@Controller("users")
export class UsersController{
constructor(private userService:UsersService){}

  @Get()  
  async showAllUsers(): Promise<SafeTransferUserDto[]>{
    return await this.userService.getAllUsers();
  }
  
  @Get("count")
  async countUsers(): Promise <object>{
    // console.log( this.userService.countAll());
    return {totalUsers: await this.userService.countAll()};
  }
  @Get("count/a")
  count2(){
    return 3;
  }
  
  @Get(":username")
  // checkUser(@Param("userId", ParseIntPipe) userId: string){
  checkUser(@Param("username") username: string){
    return {
      username: this.userService.userExists(username)};
  }
  // checkUser(@Param("userId") userId: string){
  
  @Post("addUser")
  // @UsePipes(new ValidationPipe( {transform: true} ))
  addUser(@Body() body: CreateUserDto){
    return this.userService.addNewUser(body);
  }
}