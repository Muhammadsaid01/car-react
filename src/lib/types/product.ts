import { ProductCategory, ProductCollection, ProductCondition, ProductStatus } from "../enums/product.enum";


export interface Product {
    _id: string;
    productStatus: ProductStatus;
    productCollection: ProductCollection;
    productName: string;
    productPrice: number;
    productCategory: ProductCategory;
    productCondition: ProductCondition;
	productYear: number;
	productMileage: number;
    productDesc?: string;
    productImages: string[];
    productViews: number;
    createdAt: Date;
    updatedAt: Date;


}
export interface ProductInquiry {
    order: string;
    page: number;
    limit: number;
    productCollection?: ProductCollection;
    search?:string;
}
