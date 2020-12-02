import { Service, Inject } from 'typedi';
import { SaleService } from './sale.service';
import { Sale } from './sale.model';
import * as HttpCode from 'http-status-codes';
import { EmailService } from '../email/email.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';
import { getDate } from '../utilities/utilities';
import { Cart } from '../cart/cart.model';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';

@Service() 
export class SaleController{

  constructor(
    private saleService: SaleService,
    private emailService: EmailService,
    private userService: UserService,
    private cartService: CartService,
    private productService: ProductService,
  ) {
   
  }

  /**
   * @api POST /sales 
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  async create(req, res, next) {
    const userId = req.user.id;
    
    if( !userId ) return res.status(HttpCode.BAD_REQUEST).send("Bad request");
    
    try{
      // Get the users cart
      console.log("User id of the cart",userId);
      const cart: Cart|null = await this.cartService.findByUserId(userId);
      console.log("hola que tal");
      if(!cart) return res.status(HttpCode.BAD_GATEWAY).send("This user doesn't have a cart");
      console.log("Cart found:",cart);
      let saleArray : Sale [] = [];
      const date = getDate();

      // Check if he had some products in the cart
      if(cart.productIds.length <= 0) return res.send("You had no products in the cart.");

      let productsLeft: string[] = [];
      for(let i=0; i<cart.productIds.length;i++){
        const prodId = cart.productIds[i];
        const product : Product | null = await this.productService.findById(prodId);
        //console.log("Product: ",product);

        if(!product) return res.send("One of the products doesnt exist");

        // Decrease the stock of the product if there's enough stock for it
        if(product.stock > 0 )
        {
          product.stock--;
          await this.productService.update(product);
          
          saleArray.push({
            date:date,
            userId:userId,
            productId:prodId,
            storeId: product.storeId
          });
        }
        else{
          console.log("We are OUT OF STOCK for: ",product.name);
          productsLeft.push(prodId);
        }

      }

      const newsales = await this.saleService.create(saleArray);
      // Send email to the client
      this.emailService.sendEmail(req.user.email);
      cart.productIds = productsLeft;  //empty the cart
      this.cartService.update(cart);
      res.send(newsales);
    }catch(err){
      res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR).send("Something failed. ", err.message);
    }
    
  }

  /**
   * @api GET /sales
   * 
   * @param req
   * @param res 
   * @param next 
   */
  async getAll(req, res, next) {
    
    const user = req.user;

    let filter = {};
    if(req.query.date) filter["date"] = req.query.date;

    try{
      if(user.rol == "admin"){

        const sales = await this.saleService.findAll(filter);
        return res.send(sales);

      }else if( user.rol == "store" ){
        filter["storeId"] = user.id;
        const sales = await this.saleService.findAll(filter);
        return res.send(sales);
      }
    }catch(error){

    }
      
  }

  /**
   * 
   * @api DELETE /sales/:id
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  async delete(req, res, next) {
    const saleId = req.params.id;

    if (saleId) {
      
      this.saleService.delete(saleId)
        .then(()=> {
          res.sendStatus(200);
        });
    }
  }

}