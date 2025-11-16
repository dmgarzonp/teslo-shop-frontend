import { ProductsService } from '@products/services/products.service';
import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ProductDetails } from './product-details/product-details';


@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetails],
  templateUrl: './product-admin-page.component.html',
})
export class ProductAdminPageComponent {
  //Para tomar la ruta activa
  activateRoute = inject(ActivatedRoute);

  //la navegacion o redireccion
  router = inject(Router);

  //llamar a los metodos del servicio
  productsService = inject(ProductsService);

  //Obtengo el ID del producto desde los parametros de la ruta
  productId = toSignal(
    this.activateRoute.params.pipe(
      map( params => params['id'])
    )
  );

  //con el ID traigo la data del producto
  productResource = rxResource({
    params: () => ({ id: this.productId() }),
    stream: ({ params }) => {
      return this.productsService.getProductById(params.id);
    }
  })

  redirectEffect = effect(() => {
    if( this.productResource.error() ){
      this.router.navigate(['/admin/products']);
    }
  })



 }
