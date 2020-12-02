import { Service, Inject } from 'typedi';
import { ProductService } from './product.service';
import { CategoryService } from '../category/category.service';
import { Product } from './product.model';
import * as HttpCode from 'http-status-codes';

@Service() 
export class ProductController{

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {
   
  }

  /**
   * @api POST /products 
   * 
   * This method creates a new product
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  async create(req, res, next) {
    if (req.body) {
      const product = req.body;
      product.storeId = req.user.id;
      //console.log("New product",product);

      //Check if the category exists
      const category = await this.categoryService.findByName(product.category);
      if(!category) return res.status(HttpCode.BAD_REQUEST).send("The category \"" + product.category + "\" does not exist");

      this.productService.create(product)
        .then((newproduct:Product) => {
          res.status(HttpCode.CREATED).send(newproduct);
        })
        .catch((error:Error) => {
          res.sendStatus(HttpCode.INTERNAL_SERVER_ERROR).send("Something failed. ", error.message);
        });
    }
  }

  /**
   * @api PUT /products/:id
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  async update(req, res, next) {
    if (!req.body || !req.params.id ) return res.status(HttpCode.BAD_REQUEST).send("Bad request"); 
    
    const product = req.body;
    product.id = req.params.id;

    //Check if the product is being changed by its store
    const storeId = req.user.id;
    
    try{
      const productChange = await this.productService.findById(product.id);
      if( productChange == null ) return res.status(HttpCode.NOT_FOUND).send("Product wasn't found.");
      if( storeId !== productChange.storeId ) return res.status(HttpCode.FORBIDDEN).send("You can only update your own products");
      const updatedProduct: Product | null = await this.productService.update(product);
      if( updatedProduct ) return res.send(updatedProduct);
    }
    catch(err){
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        message:"Something failed",
        error: err.message
      });
    }

  }

  /**
   * @api GET /products
   * 
   * @param req
   * @param res 
   * @param next 
   */
  async getAll(req, res, next) {
    const user = req.user;
    if( user.rol === "store" ){
      const productList:Product[] = await this.productService.findByStoreId(user.id);
      if( !productList ) return res.status(HttpCode.INTERNAL_SERVER_ERROR).send("Something failed.");
      return res.send(productList);
    }
    else{
      let filter = req.query;
      this.productService.findAll(filter)
      .then((productList:Product[])=> {
        return res.send(productList);
      }).catch((er:Error) => {
        return res.status(HttpCode.BAD_REQUEST).send("Params are not okay")
      });
      
    }
  }

  /**
   * @api GET /products/:id
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  getById(req, res, next) {
    if (req.params.id) {
      this.productService.findById(req.params.id)
        .then((product:Product | null) => {
          res.send(product);
        })
    }
  }

  /**
   * 
   * @api DELETE /products/:id
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  async delete(req, res, next) {
    const productId = req.params.id;
    if (!productId) return res.status(HttpCode.BAD_REQUEST).send("Bad request");

    const storeId = req.user.id;

    try{
      //We must check that a store is only able to delete its own products
      const productDel = await this.productService.findById(productId);
      if( productDel == null ) return res.status(HttpCode.NOT_FOUND).send("Product wasn't found.");
      if( storeId !== productDel.storeId ) return res.status(HttpCode.FORBIDDEN).send("You can only delete your own products");
      
      await this.productService.delete(productId)
      return res.sendStatus(200);
    }
    catch(err){
      return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
        message: "Something failed",
        error: err.message
      });
    }
  }

}