import { UserService } from './user.service';
import { User } from './user.model';
import { UserMongoRepository } from './repository/user.mongo.repository';
import { Database } from '../../database/database';
import { Mongoose } from 'mongoose';
import { MongoIdValidator } from '../validator/validator.mongo';
import { ErrorService } from '../../error/error';
import Container from 'typedi';

describe("User Module" , ()=> {

    let userService: UserService;
    let userId: string;
    let userEmail: string;

    beforeAll(() => {
        const containerDB = Container.get(Database);

        Container.set('user.repository', new UserMongoRepository());
        Container.set('database.validator', new MongoIdValidator());
        Container.set(ErrorService, new ErrorService());

        userService = Container.get(UserService);

        return containerDB.connectWithDatabase()
            .then((conn: Mongoose) => {
                return containerDB.flushDb(conn);
            })
            .catch((err) => {
                console.log(err);
            });
    });

    describe("#create", () => {

        it('should create a new user', () => {
            
            userEmail = "hola@gmail.com";
            let userEx :User = {
                name: "userex",
                password: "hola1234",
                email: userEmail,
                rol: "user"
            }

            return userService.create(userEx)
                .then((result: User) => {
                    userId = result.id;
                    expect(result).not.toBeNull();
                    expect(result.name).toBe(userEx.name);
                    expect(result.email).toBe(userEx.email);
                    expect(result.password).toBe(userEx.password);
                    expect(result.rol).toBe(userEx.rol);
                });
        });
    
        it('should throw an UserValidationError', () => {
            return expect(userService.create(undefined)).rejects.toThrow('UserInputValidationError');
        });
    
    });
    
    describe("#findById", () => {
    
        it('should get a user', () => {
            console.log("USERID",userId);
            return userService.findById(userId)
                .then((user: User) => {
                    expect(user).not.toBeNull();
                    expect(user.id).toEqual(userId);
                });
        });
    
        it('should  throw and InvalidUserError', () => {
            return expect(userService.findById(undefined)).rejects.toThrow('InvalidUserIdError');
        });
    
    });

    describe("#findByEmail", () => {
    
        it('should get a user based on his email', () => {

            return userService.findByEmail(userEmail)
                .then((user: User) => {
                    expect(user).not.toBeNull();
                    expect(user.email).toEqual(userEmail);
                });
        });
    
        it('should  throw and EmailInputValidationError', () => {
            return expect(userService.findByEmail(undefined)).rejects.toThrow('EmailInputValidationError');
        });
    
    });

    describe("#update", () => {

        it('should update a user', () => {

            let userEx :User = {
                "name": "usernameUdated",
                "password": "hola1234",
                "email": "hola@gmail.com",
                "id" : userId,
                "rol": "user"
            }

            return userService.update(userEx)
                .then((user: User) => {
                    expect(user).not.toBeNull();
                    expect(user.password).toEqual(userEx.password);
                    expect(user.name).toEqual(userEx.name);
                });
        });
    
        it('should  throw and UserInputValidationError', () => {
            return expect(userService.update(undefined)).rejects.toThrow('UserInputValidationError');
        });
    
    });

    describe("#delete", () => {
    
        it('should delete a User', () => {
            return userService.delete(userId)
                .then((user:User) => {
                    expect(user).toBeNull();
                });
        });
    
        it('should  throw and InvalidUserError', () => {
            return expect(userService.delete(undefined)).rejects.toThrow('InvalidUserIdError');
        });
    
    });


});