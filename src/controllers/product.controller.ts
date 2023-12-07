import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {HttpErrors, getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {Product, UserRole} from '../models';
import {FAILED_TO_SAVE, ITEM_EXIST} from '../models/error-messages';
import {Meta} from '../models/meta.model';
import {ADDED_SUCCESS} from '../models/success-message';
import {ProductRepository} from '../repositories';

export class ProductController {
  constructor(
    @repository(ProductRepository)
    private productRepository: ProductRepository
  ) { }

  @authenticate({
    strategy: 'jwt',
    options: {required: UserRole.SUPER_ADMIN}
  })
  @post('/product')
  @response(200)
  async createProduct(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            exclude: ['id', 'discount', 'deletedOn', 'deleted', 'deletedBy']
          })
        }
      }
    }) product: Omit<Product, 'id'>
  ) {
    if (!product) throw new HttpErrors.BadRequest('Product details not found')
    const EXIST = await this.productRepository.findOne({where: {name: product.name}})
    if (EXIST) throw new HttpErrors.Conflict(ITEM_EXIST)
    const PRODUCT = await this.productRepository.create(product)
    if (!PRODUCT) throw new HttpErrors[500](FAILED_TO_SAVE)
    return new Meta(ADDED_SUCCESS)
  }
}
