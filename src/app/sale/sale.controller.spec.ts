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
import { SaleMongoRepository } from "./repository/sale.mongo.repository";
import { ProductMongoRepository } from "../product/repository/product.mongo.repository";
import { CategoryMongoRepository } from "../category/repository/category.mongo.repository"
import { CartMongoRepository } from "../cart/repository/cart.mongo.repository";
import { User } from "../user/user.model";
import { Sale } from "./sale.model";
import { UserService } from "../user/user.service";
import { CartService } from "../cart/cart.service";
import { Cart } from "../cart/cart.model";
import { Product } from "../product/product.model";
import { ProductService } from "../product/product.service";
import { Category } from "../category/category.model";
import { CategoryService } from "../category/category.service";


describe('USER Controller API module', () => {
    let app: Application;
    let server: Server;
    let authCont: AuthController;
    let user: User;
    let userService: UserService;
    let cartService: CartService;
    let productService: ProductService;
    let catService: CategoryService;
    let productId : string = "productId";
    let storeId : string = "storeId";

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
        userService = Container.get(UserService);
        cartService = Container.get(CartService);
        productService = Container.get(ProductService);
        catService = Container.get(CategoryService);
        authCont = Container.get(AuthController);

        return containerDB.connectWithDatabase()
            .then((conn: Mongoose) => {
                return containerDB.flushDb(conn)
            })
            .then(() => {
                server = new Server(authCont);
                app = server.app;

                user = {
                    id: "hello",
                    name: "javier",
                    password : "hello1740",
                    email: "javieremail",
                    rol: "user"
                };

                createUserandCart(user);

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

    describe('POST sale', () =>{
        it('should create a sale', async () => {
            
            const req = request(app).post('/api/sales').set('access-token',authCont.getTokenUser(user));
            return req.then((res:any) => {
                //console.log(res);
                console.log("BODY_RESPUESTA",res.body);
                expect(res.statusCode).toBe(HttpStatus.CREATED);
                expect(res.body.productId).toBe(productId);
                expect(res.body.storeId).toBe(storeId);
                expect(res.body.userId).toBe(user.id);
                expect(res.body.date).toBe("01/01/2020");
            });
        });
    });

    
    // describe('GET all sales', () =>{
    //     it('should get all the sale of a product given its id', () => {     
    //         const req = request(app).get('/api/sales').set('access-token',authCont.getTokenUser(user));
    //         return req.then((res:any) => {
    //             expect(res.statusCode).toEqual(HttpStatus.OK);
    //             const sale = res.body[0];
    //             expect(sale.productId).toEqual(productId);
    //         });
    //     });

    // });
 
    async function createUserandCart(user:User){


        const prod: Product = {
            name: "product",
            price: 8,
            stock: 2,
            storeId: storeId,
            category: "sports" 
        }
        const newProduct = await productService.create(prod);

        console.log("Producto creado: ",newProduct);
        const newUser:User = await userService.create(user);
        const cart: Cart = {
            productIds : [newProduct.id],
            userId : newUser.id
        }
        await cartService.create(cart);
        
    }

});

