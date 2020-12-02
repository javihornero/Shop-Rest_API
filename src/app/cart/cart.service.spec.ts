import { CartService } from './cart.service';
import { Cart } from './cart.model';
import { CartMongoRepository } from './repository/cart.mongo.repository';
import { Database } from '../../database/database';
import { Mongoose } from 'mongoose';
import { MongoIdValidator } from '../validator/validator.mongo';
import { ErrorService } from '../../error/error';
import Container from 'typedi';

describe("Cart Module" , ()=> {

    let cartService: CartService;
    let cartId: string;
    let userId: string;

    beforeAll(() => {
        const containerDB = Container.get(Database);

        Container.set('cart.repository', new CartMongoRepository());
        Container.set('database.validator', new MongoIdValidator());
        Container.set(ErrorService, new ErrorService());

        cartService = Container.get(CartService);


        return containerDB.connectWithDatabase()
            .then((conn: Mongoose) => {
                return containerDB.flushDb(conn);
            })
            .catch((err) => {
                console.log(err);
            });
    });

    describe("#create", () => {

        it('should create a new cart', () => {

            userId = "javi";
            let cartEx :Cart = {
                productIds:[],
                userId: userId
            }

            return cartService.create(cartEx)
                .then( (result: Cart) => {
                    cartId = result.id;
                    expect(result).not.toBeNull();
                    expect(result.userId).toBe(cartEx.userId);
                    
                });
        });
    
        it('should throw an CartValidationError', () => {
            return expect(cartService.create(undefined)).rejects.toThrow('CartInputValidationError');
        });
    
    });

    describe("#update", () => {

        it('should update the cart', () => {

            let cartEx :Cart = {
                id: cartId,
                productIds:["afasfasf"],
                userId: userId
            }

            return cartService.update(cartEx)
                .then( (result: Cart) => {
                    expect(result).not.toBeNull();
                    expect(result.userId).toBe(cartEx.userId);
                    expect(result.productIds[0]).toBe(cartEx.productIds[0]);
                });
        });
    
        it('should throw an CartValidationError', () => {
            return expect(cartService.update(undefined)).rejects.toThrow('CartInputValidationError');
        });
    
    });

    describe("#findByUserId", () => {

        it('should find the user\'s cart', () => {
            return cartService.findByUserId(userId)
                .then( (result: Cart) => {
                    cartId = result.id;
                    expect(result).not.toBeNull();
                    expect(result.userId).toBe(userId);
                    
                });
        });
    
        it('should throw an InvalidCartIdError', () => {
            return expect(cartService.findByUserId(undefined)).rejects.toThrow('InvalidCartIdError');
        });
    
    });

    describe("#deleteByUserId", () => {

        it('should delete a user\'s cart', () => {
            return cartService.deleteByUserId(userId)
                .then( (result) => {
                    expect(result).toBeNull();
                });
        });
    
        it('should throw an InvalidCartIdError', () => {
            return expect(cartService.deleteByUserId(undefined)).rejects.toThrow('InvalidCartIdError');
        });
    
    });

});
