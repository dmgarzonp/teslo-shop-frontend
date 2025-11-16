import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Product } from '@products/interfaces/product.interface';
import { ProductCarouselComponent } from "@products/components/product-carousel/product-carousel.component";
import { FormUtils } from '@utils/form-util';
import { FormErrorLabel } from "@/shared/components/form-error-label/form-error-label";
import { ProductsService } from '@products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html',
})
export class ProductDetails implements OnInit{

  //Nesecitamos un productos
  router = inject(Router)
  product = input.required<Product>();

  producService = inject(ProductsService)
  wasSaved = signal(false);

  //para pre visualizar las imagenes
  imageFileList:  FileList | undefined = undefined;
  tempImages = signal<string[]>([]);
  imagesToCarrousel = computed(() => {
    const currentProductImages = [...this.product().images, ...this.tempImages()];

    return currentProductImages;

  })

  fb = inject(FormBuilder);
  productForm = this.fb.group({
    title: [ '', Validators.required ],
    description: [ '', Validators.required ],
    slug: [ '', [ Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: [ 0, [ Validators.required, Validators.min(0)] ],
    stock: [ 0, [ Validators.required, Validators.min(0)] ],
    sizes: [[ '' ]],
    images: [[]],
    tags: [''],
    gender: ['men', [ Validators.required, Validators.pattern(/men|women|kid|unisex/) ]],

  })

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue( this.product() );
  }

  setFormValue( formLike: Partial<Product> ){
    // this.productForm.patchValue( formLike as any );
    this.productForm.reset(this.product() as any)
    this.productForm.patchValue({ tags: formLike.tags?.join(', ') } );


  }

  onSizeCliked(size: string){
    const currenSizes = this.productForm.value.sizes ?? [];
    if( currenSizes.includes(size) ){
      currenSizes.splice(currenSizes.indexOf(size), 1);
    } else {
      currenSizes.push(size);
    }
    this.productForm.patchValue({ sizes: currenSizes });

  }

  async onSubmit(){
    const isValid = this.productForm.valid;
    //mostrar al usuario los errores
    this.productForm.markAllAsTouched();

    if(!isValid) return;
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {

      ...(formValue as any),
      tags: formValue.tags
      ?.toLowerCase()
      .split(',').map( tag => tag.trim()) ?? [],
    };

    if( this.product().id === 'new'){
      //crear producto
      const product = await firstValueFrom(
        this.producService.createProduct(productLike, this.imageFileList)
      )
        this.router.navigate(['/admin/products', product.id ]);



    } else {

       await firstValueFrom(this.producService.updateProduct(this.product().id,productLike, this.imageFileList));
    }
    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);

  }

  onFilesChanged(event: Event){
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;

    const imageUrls = Array.from(fileList ?? []).map( file => URL.createObjectURL(file));

    this.tempImages.set(imageUrls);




  }



}

