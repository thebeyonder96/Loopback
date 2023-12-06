import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody, response} from '@loopback/rest';
import {Product, UserRole} from '../models';
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
            exclude: ['id', 'discount']
          })
        }
      }
    }) product: Omit<Product, 'id'>
  ) {
    const PRODUCT = await this.productRepository.create(product)
    return PRODUCT
  }
}
