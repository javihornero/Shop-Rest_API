import 'reflect-metadata';

import { Mongoose } from 'mongoose';
import { Container } from 'typedi';

import { MongoIdValidator } from './app/validator/validator.mongo';
import { Database } from './database/database';
import { Server } from './server/server';

import { ProductMongoRepository } from './app/product/repository/product.mongo.repository';
import { UserMongoRepository } from './app/user/repository/user.mongo.repository';
import { CategoryMongoRepository } from './app/category/repository/category.mongo.repository';
import { CartMongoRepository } from './app/cart/repository/cart.mongo.repository';
import { ReviewMongoRepository } from './app/review/repository/review.mongo.repository';
import { SaleMongoRepository } from './app/sale/repository/sale.mongo.repository';

init();

function init(): void {
  const containterDB = Container.get(Database);

  Container.set('database.validator', new MongoIdValidator());

  _initResourceDependencies();

  containterDB.connectWithDatabase()
    .then((conn: Mongoose) => {
      Container.get(Server);
    })
    .catch((err) => {
      console.error('MongoDB connection error: ' + err);
      process.exit(-1);
    });
}

function _initResourceDependencies(): void {
  
  Container.set('cart.repository', new CartMongoRepository());
  Container.set('category.repository', new CategoryMongoRepository());
  Container.set('product.repository', new ProductMongoRepository());
  Container.set('review.repository', new ReviewMongoRepository());
  Container.set('sale.repository', new SaleMongoRepository());
  Container.set('user.repository', new UserMongoRepository());
  
}
