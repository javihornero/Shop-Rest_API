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
import { ReviewMongoRepository } from "./repository/review.mongo.repository";
import { SaleMongoRepository } from "../sale/repository/sale.mongo.repository";
import { ProductMongoRepository } from "../product/repository/product.mongo.repository";
import { CategoryMongoRepository } from "../category/repository/category.mongo.repository"
import { CartMongoRepository } from "../cart/repository/cart.mongo.repository";
import { User } from "../user/user.model";
import { Review } from "./review.model";


describe('USER Controller API module', () => {
    let app: Application;
    let server: Server;
    let authCont: AuthController;
    let user: User;
    let productId : string = "productId";

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

    describe('POST review', () =>{
        it('should create a review for a product', () => {
            user = {
                id: "hello",
                name: "javier",
                password : "hello1740",
                email: "javieremail",
                rol: "user"
            };

            const newReview : Review = {
                content: "Amazing product",
            }
            const req = request(app).post('/api/products/'+productId+"/reviews").send(newReview).set('access-token',authCont.getTokenUser(user));
            return req.then((res:any) => {
                //console.log("BODY_RESPUESTA",res.body);
                expect(res.statusCode).toBe(HttpStatus.CREATED);
                expect(res.body.content).toBe(newReview.content);
                expect(res.body.productId).toBe(productId);
                expect(res.body.userId).toBe(user.id);
            });
        });
    });

    
    describe('GET all reviews for a product', () =>{
        it('should get all the review of a product given its id', () => {     
            const req = request(app).get('/api/products/'+productId+"/reviews").set('access-token',authCont.getTokenUser(user));
            return req.then((res:any) => {
                expect(res.statusCode).toEqual(HttpStatus.OK);
                const review = res.body[0];
                expect(review.productId).toEqual(productId);
            });
        });

    });
 
});