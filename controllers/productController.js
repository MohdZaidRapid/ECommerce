import slugify from "slugify"
import productModel from "../models/productModel.js"
import categoryModel from '../models/categoryModel.js'
import orderModel from "../models/orderModel.js"
import fs from 'fs'
import dotenv from "dotenv";
import braintree from "braintree"


// payment gateway
dotenv.config()

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }


        const products = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating product"
        })
    }
}

//get all products
export const getProductController = async (req, res) => {
    try {
        const products = await productModel.find({}).populate("category").select("-photo").limit(12).sort({ createdAt: -1 })
        res.status(200).send({
            success: true,
            message: "All products",
            products,
            totalCount: products.length
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Error in getting products",
            error: error.message,
            success: false
        })
    }
}

export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findOne({ slug: req.params.slug }).populate("category").select("-photo")
        res.status(200).send({
            message: "Single product",
            success: false,
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while getting single product",
            error
        })
    }
}

// console.log(process.env.BRAINTREE_MERCHANT_ID,process.env.BRAINTREE_PUBLIC_KEY,BRAINTREE_PRIVATE_KEY)
export const productPhotoController = async (req, res) => {
    try {
        console.log(req.params.pid)
        const product = await productModel.findById(req.params.pid).select("photo")
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: true,
            message: "Error while getting photo",
            error
        })
    }
}

//delete product controller
export const deleteProductController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.pid).select("-photo")
        res.status(200).send({
            success: false,
            message: "Product Deleted successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while deleting process",
            error
        })
    }
}

export const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }


        const products = await productModel.findByIdAndUpdate(req.params.pid, {
            ...req.fields,
            slug: slugify(name)
        }, { new: true })
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error in update product"
        })
    }
}

//filetr product
export const productFilterController = async (req, res) => {
    try {
        console.log(process.env.BRAINTREE_MERCHANT_ID, process.env.BRAINTREE_PUBLIC_KEY, BRAINTREE_PRIVATE_KEY)
        const { checked, radio } = req.body;
        let args = {}
        if (checked.length > 0) {
            args.category = checked
        }
        if (radio.length) {
            args.price = { $gte: radio[0], $lte: radio[1] }

        }
        const products = await productModel.find(args)
        res.status(200).send({
            success: true,
            products
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: "Filter while Filtering Products", error })
    }
}

export const productCountController = async (req, res) => {
    try {
        const total = await productModel.find({}).estimatedDocumentCount()
        console.log("total" + total)
        res.status(200).send({
            success: true,
            total,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({ success: false, message: "Filter while Product Count", error })
    }
}

export const productListController = async (req, res) => {
    try {

        const perPage = 2;
        const page = req.params.page ? req.params.page : 1
        const products = await productModel.find({}).select("-photo").skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 })
        res.status(200).send({ success: true, products })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "error in page ctrl",
            error
        })
    }
}

export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params
        const results = await productModel.find({
            $or: [{
                name: { $regex: keyword, $options: "i" },
                description: { $regex: keyword, $options: "i" }
            }]
        }).select("-photo")
        res.json(results)
    } catch (error) {
        console.log(error)
        res.status({
            success: true,
            message: "Error in Search Product API",
            error
        })
    }
}

// similar product
export const relatedProductController = async (req, res) => {
    try {
        const { cid, pid } = req.params
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid },
        }).select("-photo").limit(3).populate("category")

        res.status(200).send({
            success: true,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "error while getting related product",
            error
        })
    }
}


// get prouduct by category
export const productCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        const products = await productModel.find({ category }).populate("category")
        res.status(200).send({
            success: true,
            category,
            products
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            error,
            message: "Error While Getting products"
        })

    }
}


export const braintreeTokenController = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, result) {
            if (err) {
                res.status(500).send(err)
            } else {
                res.send(result)
            }
        })
    } catch (error) {
        console.log(error)

    }
}

export const braintreePaymentController = async (req, res) => {
    try {
        const { cart, nonce } = req.body
        let total = 0;
        cart.map((i) => { total += i.price })
        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,
            }
        },
            function (err, result) {
                if (result) {
                    const order = new orderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id
                    }).save()
                    res.json({ ok: true })
                } else {
                    res.status(500).send(error)
                }
            }
        )

    } catch (error) {
        console.log(error)
    }
}

