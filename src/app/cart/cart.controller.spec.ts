import 'reflect-metadata';
import { Application} from "express-serve-static-core";
import { Server } from "../../server/server";
import Container from 'typedi';
import { Database } from '../../database/database';
import { Mongoose } from 'mongoose';
import { CartMongoRepository } from "../cart/repository/cart.mongo.repository";
import { UserMongoRepository } from "../user/repository/user.mongo.repository";
import { ReviewMongoRepository } from "../review/repository/review.mongo.repository";
import { SaleMongoRepository } from "../sale/repository/sale.mongo.repository";
import { ProductMongoRepository } from "../product/repository/product.mongo.repository";
import { CategoryMongoRepository } from "../category/repository/category.mongo.repository";
import { AuthController } from "../auth/auth.controller";
import { MongoIdValidator } from "../validator/validator.mongo";
import { ErrorService } from "../../error/error";
const request = require('supertest');
//import * as request from 'supertest';
import * as HttpStatus from "http-status-codes";

describe('CART Controller API module', () => {

    let app: Application;
    let server: Server;
    let authController: AuthController;
    let user;

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

    describe('POST cart', () =>{
        it('should CREATE the user\'s cart', () => {
            
            user = {
                id: "hola",
                name: "Javier",
                email: "javier@yopmail.com",
                password: "javier1234",
                rol: "user"
            };

            const token = authController.getTokenUser(user);
            const req = request(app).post('/api/carts').set('access-token',token)
            return req.then((res:any) => {
                //console.log("Respuesta carro post:",res.body);
                expect(res.statusCode).toEqual(HttpStatus.CREATED);
                expect(res.body.userId).toBe(user.id);
            })
            .catch((err:Error) => {
                console.log("ERROR_MESSAGE:",err.message);
            });
        });

    });

    describe('GET cart', () =>{
        it('should GET the user\'s cart', () => {
            
            const token = authController.getTokenUser(user);
            const req = request(app).get('/api/carts').set('access-token',token);
            return req.then((res:any) => {
                //console.log("Respuesta carro get:",res.text);
                expect(res.statusCode).toEqual(HttpStatus.OK);
                
            })
            .catch((err:Error) => {
                console.log("ERROR_MESSAGE:",err.message);
            });
        });

    });

    describe('UPDATE cart', () =>{
        it('should UPDATE the user\'s cart', () => {
            const productId = "productId";
            const token = authController.getTokenUser(user);
            const req = request(app).put('/api/carts?productId='+productId).set('access-token',token)
            return req.then((res:any) => {
                //console.log("Respuesta carro PUT:",res.body);
                expect(res.statusCode).toEqual(HttpStatus.OK);
                expect(res.body.userId).toEqual(user.id);
                expect(res.body.productIds[0]).toBe(productId);
            })
            .catch((err:Error) => {
                console.log("ERROR_MESSAGE:",err.message);
            });
        });

    });

});