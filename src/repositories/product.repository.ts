import {inject} from '@loopback/core';
import {SoftCrudRepository} from 'loopback4-soft-delete';
import {UserDataSource} from '../datasources';
import {Product, ProductRelations} from '../models';

export class ProductRepository extends SoftCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {
  constructor(
    @inject('datasources.user') dataSource: UserDataSource,
  ) {
    super(Product, dataSource);
  }
}
