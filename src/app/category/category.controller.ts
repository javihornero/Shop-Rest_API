import { Service, Inject } from 'typedi';
import { CategoryService } from './category.service';
import { Category } from './category.model';
import * as HttpStatus from "http-status-codes";

@Service() 
export class CategoryController {

  constructor(
    private categoryService: CategoryService
  ) {

  }

  /**
   * @api POST /categories 
   * 
   * This method creates a new category
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  create(req, res, next) {
    if (req.body) {
      const category:Category = req.body;

      this.categoryService.create(category)
        .then((newcategory:Category) => {
          res.status(HttpStatus.CREATED).send(newcategory);
        });
    }
  }

  /**
   * @api PUT /categories
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  update(req, res, next) {
    if (req.body && req.params.id ) {
      const category:Category = req.body;
      category.id = req.params.id;

      this.categoryService.update(category)
        .then((updatedcategory:Category | null) => {
          res.send(updatedcategory);
        });
    }
  }

  /**
   * @api GET /categories
   * 
   * @param req
   * @param res 
   * @param next 
   */
  getAll(req, res, next) {
    
    this.categoryService.findAll()
      .then((categoryList:Category[])=> {
        res.send(categoryList);
      });
  }

  /**
   * @api GET /categories/:id
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  getById(req, res, next) {
    if (req.params.id) {
      this.categoryService.findById(req.params.id)
        .then((category:Category | null) => {
          res.send(category);
        })
    }
  }

  /**
   * 
   * @api DELETE /categories/:id
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  delete(req, res, next) {
    if (req.params.id) {
      this.categoryService.delete(req.params.id)
        .then(()=> {
          res.sendStatus(200);
        });
    }
  }

}