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
import { ProductMongoRepository } from "./repository/product.mongo.repository";
import { CategoryMongoRepository } from "../category/repository/category.mongo.repository";
import { AuthController } from "../auth/auth.controller";
import { MongoIdValidator } from "../validator/validator.mongo";
import { ErrorService } from "../../error/error";
const request = require('supertest');
//import * as request from 'supertest';
import * as HttpStatus from "http-status-codes";
import { User } from "../user/user.model";
import { Product } from './product.model';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/category.model';

describe('Product Controller API module', () => {

    let app: Application;
    let server: Server;
    let authController: AuthController;
    let categService: CategoryService;
    let productId: string;
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
        categService = Container.get(CategoryService);
        Container.set(ErrorService, new ErrorService());
        authController = Container.get(AuthController);

        return containerDB.connectWithDatabase()
            .then((conn: Mongoose) => {
                return containerDB.flushDb(conn)
            })
            .then(async () => {
                server = new Server(authController);
                app = server.app;

                const categ : Category = {
                    name: "sports"
                }
    
                await categService.create(categ);
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

    describe('POST product', () =>{
        it('should CREATE a product', async () => {
            
            user = {
                id: "storeId",
                name: "Javier",
                email: "javier@yopmail.com",
                password: "javier1234",
                rol: "store"
            };
            
            const prod: Product = {
                name: "product",
                price: 8,
                stock: 2,
                storeId: "storeId",
                category: "sports" 
            }
            

            const token = authController.getTokenUser(user);
            const req = request(app).post('/api/products').send(prod).set('access-token',token)
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.CREATED);
                productId = res.body._id;
                expect(res.body.name).toBe(prod.name);
                expect(res.body.price).toBe(prod.price);
                expect(res.body.stock).toBe(prod.stock);
                expect(res.body.storeId).toBe(prod.storeId);
                expect(res.body.category).toBe(prod.category);

            });
            
        });

    });

    describe('PUT product', () =>{
        it('should UPDATE a product', () => {
            
            const prod: Product = {
                id: productId,
                name: "product",
                price: 8,
                stock: 20,
                storeId: "storeId",
                category: "sports" 
            }

            const token = authController.getTokenUser(user);
            const req = request(app).put('/api/products/'+productId).send(prod).set('access-token',token)
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.OK);
                expect(res.body.name).toBe(prod.name);
                expect(res.body.price).toBe(prod.price);
                expect(res.body.stock).toBe(prod.stock);
                expect(res.body.storeId).toBe(prod.storeId);
                expect(res.body.category).toBe(prod.category);

            });
            
        });

    });

    describe('GET product', () =>{
        it('should GET a product given its id', () => {

            const token = authController.getTokenUser(user);
            const req = request(app).get('/api/products/'+productId).set('access-token',token)
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.OK);
                expect(res.body._id).toEqual(productId);
            });
            
        });

    });

    describe('GET all products', () =>{
        it('should GET all products as a store', () => {

            const token = authController.getTokenUser(user);
            const req = request(app).get('/api/products').set('access-token',token)
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.OK);
                //console.log("Respuesta GET ALL: ",res.body);
                expect(res.body[0]._id).toEqual(productId);
            });
            
        });

        it('should GET all products as a normal user based on category', () => {
            user.rol = "user";
            const token = authController.getTokenUser(user);
            const req = request(app).get('/api/products?category=sports').set('access-token',token)
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.OK);
                //console.log("Respuesta GET ALL: ",res.body);
                expect(res.body[0]._id).toEqual(productId);
            });
            
        });

        it('should GET all products as a normal user based on price', () => {
            user.rol = "user";
            const token = authController.getTokenUser(user);
            const req = request(app).get('/api/products?minPrice=3&maxPrice=50').set('access-token',token)
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.OK);
                //console.log("Respuesta GET ALL: ",res.body);
                expect(res.body[0]._id).toEqual(productId);
            });
            
        });

    });

    describe('DELETE product', () =>{
        it('should DELETE a product given its id', () => {
            user.rol = "store";
            const token = authController.getTokenUser(user);
            const req = request(app).delete('/api/products/'+productId).set('access-token',token)
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.OK);
            });
            
        });

    });

});