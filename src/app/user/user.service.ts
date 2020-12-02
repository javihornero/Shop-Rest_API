import { Service, Inject } from "typedi";
import { UserRepository } from "./repository/user.repository";
import { User } from './user.model';
import 'reflect-metadata';
import { ErrorService } from '../../error/error';

@Service()
export class UserService {

  constructor(
    @Inject('user.repository') private userRepository: UserRepository,
    private readonly errorService: ErrorService
  ) {

  }

  async create(user: User): Promise<User> {
    if( this.isValidUser(user) ){
      return await this.userRepository.create(user);
    }
    else{
      return Promise.reject(this.errorService.createInputValidationError('User'));
    }
  }

  async update(user: User): Promise<User | null> {
    if( this.isValidUser(user) ){
      return await this.userRepository.update(user);
    }
    else{
      return Promise.reject(this.errorService.createInputValidationError('User'));
    }
  }

  async findById(userId: string): Promise<User | null> {
    if( userId !== undefined ){
      return await this.userRepository.findById(userId);
    }
    else{
      return Promise.reject(this.errorService.createInvalidIdError('User'));
    }
  }

  async findAll(): Promise<Array<User>> {
    return await this.userRepository.findAll();
  }

  async delete(userId: string): Promise<null> {
    if( userId !== undefined ){
      return await this.userRepository.delete(userId);
    }
    else{
      return Promise.reject(this.errorService.createInvalidIdError('User'));
    }
  }

  async findByEmail(email: string): Promise<User|null> {
    if( email !== undefined ){
      return await this.userRepository.findByEmail(email);
    }
    else{
      return Promise.reject(this.errorService.createInputValidationError('Email'));
    }
  }

  private isValidUser(user:User):boolean{
    return user && user.name !== null && user.name !== undefined;
  }
  

}