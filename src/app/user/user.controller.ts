import { Service, Inject } from 'typedi';
import { UserService } from './user.service';
import { User } from './user.model';

import * as HttpCodes from 'http-status-codes';
import { CartService } from '../cart/cart.service';
import { Cart } from '../cart/cart.model';

@Service() 
export class UserController {

  constructor( private userService: UserService ,
    private cartService: CartService)
  {
    
  }

  /**
   * @api POST /users 
   * 
   * This method creates a new user
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  create(req, res, next) {
    const user = req.body;
    if (user) {
      
      this.userService.create(user)
        .then( async (newUser:User) => {
          //if the user is NORMAL create a cart
          if(newUser.rol === "user"){
            let newCart: Cart = {
              "userId": newUser.id,
              "productIds" : []
            }
            let cart:Cart = await this.cartService.create(newCart);
            return res.status(HttpCodes.CREATED).json({user: newUser , cart: cart});
          }
          return res.status(HttpCodes.CREATED).send(newUser);
        })
        .catch((ex)=>{
          if(ex.code === 11000 ){ //duplicate key
            const email = ex.keyValue.email;
            res.status(HttpCodes.CONFLICT).send("The email: \"" + email + "\" is already in use.");
          }
        });
    }

  }

  /**
   * @api PUT /users
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  update(req, res, next) {
    if (req.body ) {
      let user = req.body;
      
      // req.user.id is set in the verifyApiREquest in AuthController
      // only a user can update himself
      user.id = req.user.id;

      //update that user
      this.userService.update(user)
      .then((updatedUser:User | null) => {
        res.send(updatedUser);
      });

    }
    else{
      res.status(HttpCodes.BAD_REQUEST).send("No information was sent.");
    }
  }

  /**
   * @api GET /users
   * 
   * @param req
   * @param res 
   * @param next 
   */
  getAll(req, res, next) {
    //console.log(req.authUser);
    const user = req.user;
    if(user.rol == "admin"){
      this.userService.findAll()
      .then((userList:User[])=> {
        res.send(userList);
      });
    }else{
      this.userService.findById(user.id)
      .then((user:User|null)=> {
        res.send(user);
      });
    }
    
  }


  /**
   * 
   * @api DELETE /users/:id
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  delete(req, res, next) {
    const userId = req.params.id;
    if( !userId ) return res.status(HttpCodes.BAD_REQUEST).send("NO user id");
    
    this.userService.delete(userId)
      .then(async ()=> {
        await this.cartService.deleteByUserId(userId);
        return res.status(200).send("THE user was deleted succesfully");
      })
      .catch( (error:Error) => {
        console.log("Error: ",error.message);
      } );
    
  }
  
}