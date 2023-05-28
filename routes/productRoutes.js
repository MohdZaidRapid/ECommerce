import express from 'express'
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import { braintreePaymentController, braintreeTokenController, createProductController, deleteProductController, getProductController, getSingleProductController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, relatedProductController, searchProductController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable';



const router = express.Router()

//routes

router.post("/create-product", requireSignIn, isAdmin, formidable(), createProductController)

router.put("/update-product/:pid", requireSignIn, isAdmin, formidable(), updateProductController)

//get Product 
router.get("/get-product", getProductController)

//single-product
router.get("/get-product/:slug", getSingleProductController)

//get photo
router.get("/product-photo/:pid", productPhotoController)

//delete photo
router.delete("/delete-product/:pid", deleteProductController)

//filter produuct
router.post("/product-filters", productFilterController)

//product count
router.get("/product-count", productCountController)

//product per page
router.get("/product-list/:page", productListController)

// search product page
router.get("/search/:keyword", searchProductController)

//similar products
router.get("/related-product/:pid/:cid", relatedProductController)

//categories wise product 
router.get("/product-category/:slug", productCategoryController)

// payment route 
// token
router.get("/braintree/token", braintreeTokenController)

// payments 
router.post("/braintree/payment", requireSignIn, braintreePaymentController)

export default router