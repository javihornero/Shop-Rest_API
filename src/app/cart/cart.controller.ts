import { Service, Inject } from 'typedi';
import { CartService } from './cart.service';
import { Cart } from './cart.model';
import * as HttpCode from 'http-status-codes';


@Service() 
export class CartController {

  constructor(
    private cartService: CartService
  ) {

  }


  /**
   * @api POST /carts
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  async create(req, res, next) {
      //GEt the cart that belongs to the specific user
      const userId = req.user.id;

      let newCart: Cart = {
        "userId": userId,
        "productIds" : []
      }
      let cart:Cart = await this.cartService.create(newCart);
      if( !cart ) return res.status(HttpCode.INTERNAL_SERVER_ERROR).send("Something failed.");
      return res.status(HttpCode.CREATED).send(cart);
  }

  /**
   * @api PUT /carts
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  async update(req, res, next) {
    
    //GEt the cart that belongs to the specific user
    const userId = req.user.id;
    let cart: Cart | null = await this.cartService.findByUserId(userId);

    if(!cart) return res.status(HttpCode.NOT_FOUND).send("No cart was found");

    // Introduce a product in the cart
    const productId = req.query.productId;
    if(productId) cart.productIds.push(productId);

    this.cartService.update(cart)
      .then((updatedcart:Cart | null) => {
        res.send(updatedcart);
    })
      .catch((er:Error) => {
        res.status(HttpCode.INTERNAL_SERVER_ERROR).send("Something failed.");
      });
    
  }

  /**
   * @api GET /carts
   * 
   * @param req
   * @param res 
   * @param next 
   */
  async get(req, res, next) {

    const userId = req.user.id;

    if( !userId ) return res.status(HttpCode.BAD_REQUEST).send("No user id found.");

    const cart:Cart|null = await this.cartService.findByUserId(userId);

    if(!cart) return res.status(HttpCode.NOT_FOUND).send("This user doesn't have a cart.");

    return res.status(HttpCode.OK).send(cart);
  }


}