import { ReviewService } from './review.service';
import { Review } from './review.model';
import { ReviewMongoRepository } from './repository/review.mongo.repository';
import { Database } from '../../database/database';
import { Mongoose } from 'mongoose';
import { MongoIdValidator } from '../validator/validator.mongo';
import { ErrorService } from '../../error/error';
import Container from 'typedi';

describe("Review Module" , ()=> {

    let reviewService: ReviewService;
    let reviewId: string;
    let productId: string = "productID";

    beforeAll(() => {
        const containerDB = Container.get(Database);

        Container.set('review.repository', new ReviewMongoRepository());
        Container.set('database.validator', new MongoIdValidator());
        Container.set(ErrorService, new ErrorService());

        reviewService = Container.get(ReviewService);

        return containerDB.connectWithDatabase()
            .then((conn: Mongoose) => {
                return containerDB.flushDb(conn);
            })
            .catch((err) => {
                console.log(err);
            });
    });

    describe("#create", () => {

        it('should create a new review', () => {

            let reviewEx :Review = {
                content: "newReview",
                productId: productId,
                userId: "userId"
            }

            return reviewService.create(reviewEx)
                .then( (result: Review) => {
                    reviewId = result.id;
                    expect(result).not.toBeNull();
                    expect(result.content).toBe(reviewEx.content);
                    expect(result.productId).toBe(reviewEx.productId);
                    expect(result.userId).toBe(reviewEx.userId);
                    
                });
        });
    
        it('should throw an ReviewValidationError', () => {
            return expect(reviewService.create(undefined)).rejects.toThrow('ReviewInputValidationError');
        });
    
    });

    describe("#findAll", () => {

        it('should find the reviews of a given product', () => {
            return reviewService.findAll(productId)
                .then( (result: Review[]) => {
                    expect(result).not.toBeNull();
                    expect(result[0].id).toBe(reviewId);
                });
        });
    
        it('should throw an InvalidReviewIdError', () => {
            return expect(reviewService.findAll(undefined)).rejects.toThrow('InvalidProductIdError');
        });
    
    });

    describe("#delete", () => {

        it('should delete a user\'s review', () => {
            return reviewService.delete(reviewId)
                .then( (result) => {
                    expect(result).toBeNull();
                });
        });
    
        it('should throw an InvalidReviewIdError', () => {
            return expect(reviewService.delete(undefined)).rejects.toThrow('InvalidReviewIdError');
        });
    
    });

});
