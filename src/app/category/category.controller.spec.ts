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
import { CategoryMongoRepository } from "./repository/category.mongo.repository";
import { CartMongoRepository } from "../cart/repository/cart.mongo.repository";
import { User } from "../user/user.model";
import { Category } from "../category/category.model";

describe('USER Controller API module', () => {
    let app: Application;
    let server: Server;
    let authCont: AuthController;
    let categoryId: string;
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
        authCont = Container.get(AuthController);

        return containerDB.connectWithDatabase()
            .then((conn: Mongoose) => {
                return containerDB.flushDb(conn)
            })
            .then(() => {
                server = new Server(authCont);
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

    describe('POST category', () =>{
        it('should create a category', () => {
            user = {
                name: "javier",
                password : "hello1740",
                email: "javieremail",
                rol:"admin"
            };
            const categ : Category = {
                name: "newCategory"
            }
            const req = request(app).post('/api/categories').send(categ).set('access-token',authCont.getTokenUser(user));
            return req.then((res:any) => {
                //console.log("BODY_RESPUESTA",res.body);
                categoryId = res.body._id;
                expect(res.statusCode).toBe(HttpStatus.CREATED);
                expect(res.body.name).toBe(categ.name);
                
                
            });
        });
    });

    describe('PUT category', () =>{
        it('should update a category', () => {
            const categ : Category = {
                name: "newCategoryUPdated"
            }
            const req = request(app).put('/api/categories/'+categoryId,).send(categ).set('access-token',authCont.getTokenUser(user));
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.OK);
                expect(res.body.name).toEqual(categ.name);
                
            });
        });

    });

    describe('GET category', () =>{
        it('should get a category given an id', () => {
            
            const req = request(app).get('/api/categories/'+categoryId,).set('access-token',authCont.getTokenUser(user));
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.OK);
                expect(res.body._id).toEqual(categoryId);
                
            });
        });

    });

    describe('DELETE category', () =>{
        it('should delete a category', () => {
            
            const req = request(app).delete('/api/categories/'+categoryId).set('access-token',authCont.getTokenUser(user));
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.OK);
                
            });
        });

    });
 
});