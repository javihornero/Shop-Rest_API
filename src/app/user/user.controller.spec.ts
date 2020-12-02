import { Application} from "express-serve-static-core";
import { Server } from "../../server/server";
import Container from 'typedi';
import { Database } from '../../database/database';
import { Mongoose } from 'mongoose';
import { UserMongoRepository } from "../user/repository/user.mongo.repository";
import { AuthController } from "../auth/auth.controller";
import { MongoIdValidator } from "../validator/validator.mongo";
import { ErrorService } from "../../error/error";
const request = require('supertest');
import * as HttpStatus from "http-status-codes";
import 'reflect-metadata';
import { ReviewMongoRepository } from "../review/repository/review.mongo.repository";
import { SaleMongoRepository } from "../sale/repository/sale.mongo.repository";
import { ProductMongoRepository } from "../product/repository/product.mongo.repository";
import { CategoryMongoRepository } from "../category/repository/category.mongo.repository";
import { CartMongoRepository } from "../cart/repository/cart.mongo.repository";
import { User } from "./user.model";

describe('USER Controller API module', () => {
    let app: Application;
    let server: Server;
    let authController: AuthController;
    let user: User;

    beforeAll( () => {
        const containerDB = Container.get(Database);
        Container.set('database.validator', new MongoIdValidator());
        Container.set('cart.repository', new CartMongoRepository());
        Container.set('user.repository', new UserMongoRepository());
        Container.set('review.repository', new ReviewMongoRepository());
        Container.set('sale.repository', new SaleMongoRepository());
        Container.set('product.repository', new ProductMongoRepository());
        Container.set('category.repository', new CategoryMongoRepository());
        Container.set(ErrorService, new ErrorService());
        authController = Container.get(AuthController);

        return containerDB.connectWithDatabase()
            .then((conn: Mongoose) => {
                return containerDB.flushDb(conn)
            })
            .then(() => {
                server = new Server(authController);
                app = server.app;
            })
            .catch((err) => {
                console.log(err);
            });
    });

    afterAll(() => {
        server.httpServer.close(() => {
            console.log('closing http server');
        });
    });

    describe('POST user', () =>{
        it('should create a user', () => {
            user = {
                name: "javier",
                password : "hello1740",
                email: "javieremail",
                rol:"user"
            };
            const req = request(app).post('/auth/users').send(user);
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.CREATED);
                const use = res.body.user;
                user.id = use._id;
                //console.log("BODY_RESPUESTA",res.body);
                expect(use.name).toEqual(user.name);
                expect(use.password).toEqual(user.password);
                
            });
        });

    });

    describe('PUT user', () =>{
        it('should update a user', () => {
            user.password = "updatedpass";
            const req = request(app).put('/api/users').send(user).set('access-token',authController.getTokenUser(user));
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.OK);
                //console.log("BODY_RESPUESTA_UPDATE",res.body);
                expect(res.body.password).toEqual(user.password);
                expect(res.body._id).toEqual(user.id);
                
            });
        });

    });

    describe('DELETE user', () =>{
        it('should return a FORBIDDEN status code because only Admins can delete a user', () => {
            
            const req = request(app).delete('/api/users/'+user.id).set('access-token',authController.getTokenUser(user));
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
            });
        });

        it('should delete a user', () => {
            user.rol = "admin";
            const req = request(app).delete('/api/users/'+user.id).set('access-token',authController.getTokenUser(user));
            return req.then((res:any) => {
                console.log("REspuesta",res.body);
                expect(res.statusCode).toEqual(HttpStatus.OK);
            })
            .catch((error:Error) => {
                console.log("Error: ", error.message );
            });
        });

    });

});