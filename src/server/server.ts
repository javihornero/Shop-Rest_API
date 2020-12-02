import { json, urlencoded } from 'body-parser';
import { Application } from 'express';
import Container, { Service } from 'typedi';

// These lines don't work if I include the tsconfig.json ( "resolveJsonModule": true,"esModuleInterop": true)
// import * as cors from 'cors';
// import * as express from 'express';
//import * as morgan from 'morgan';
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
import * as http from 'http';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDoc from "../swagger.json";

import { config } from '../config/environment';
import { AuthController } from '../app/auth/auth.controller';

//Api imports
import { ProductApi } from './api/productApi';
import { CartApi } from './api/cartApi';
import { CategoryApi } from './api/categoryApi';
import { ReviewApi } from './api/reviewApi';
import { UserApi } from './api/userApi';
import { AuthApi } from './api/authApi';
import { SaleApi } from './api/saleApi';

@Service()
export class Server {

  app: Application;
  httpServer: http.Server;
  private readonly productApi: ProductApi;
  private readonly cartApi: CartApi;
  private readonly categoryApi: CategoryApi;
  private readonly userApi: UserApi;
  private readonly reviewApi: ReviewApi;
  private readonly saleApi: SaleApi;
  private readonly authApi: AuthApi;

  constructor(
    private authController: AuthController
    ) {
    this.app = express();
    this.productApi = Container.get(ProductApi);
    this.cartApi = Container.get(CartApi);
    this.categoryApi = Container.get(CategoryApi);
    this.userApi = Container.get(UserApi);
    this.reviewApi = Container.get(ReviewApi);
    this.saleApi = Container.get(SaleApi);
    this.authApi = Container.get(AuthApi);
    this.setupServer();
  }

  private setupServer(): void {
    this.app.use( cors());
    this.app.use( json({ limit: '5mb' }));
    this.app.use( urlencoded({ extended: false }));
    this.app.use( morgan('dev'));

    // API Documentation with swagger
    this.app.use("/swagger",swaggerUi.serve,swaggerUi.setup(swaggerDoc));

    //Checking for token
    this.app.use('/api',            this.authController.verifyApiRequest);

    // Base of the endpoints
    this.app.use('/auth',           this.authApi.getApiRouter());
    this.app.use('/api/products',   this.productApi.getApiRouter());
    this.app.use('/api/users',      this.userApi.getApiRouter());
    this.app.use('/api/categories', this.categoryApi.getApiRouter());
    this.app.use('/api/carts',      this.cartApi.getApiRouter());
    this.app.use('/api/products',   this.reviewApi.getApiRouter()); // uses nested endpoint
    this.app.use('/api/sales',      this.saleApi.getApiRouter());

    this.httpServer = this.app.listen(config.port, this.onHttpServerListening);
  }


  private onHttpServerListening(): void {
    console.log('Server Express started in %s mode (ip: %s, port: %s)', config.env, config.ip, config.port);
  }

}
