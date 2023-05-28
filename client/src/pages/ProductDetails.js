import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout/Layout'
import axios from 'axios'
import { useParams } from 'react-router-dom'




const ProductDetails = () => {
    const params = useParams()
    const [product, setProduct] = useState({})
    const [realtedProducts, setRelatedProducts] = useState([])

    //get similar product
    const getSimilarProducts = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`)
            setRelatedProducts(data?.products)

        } catch (error) {
            console.log(error)
        }
    }
    //getProduct
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`)
            setProduct(data?.product)
            getSimilarProducts(data?.product._id, data?.product.category._id)
        } catch (error) {
            console.log(error)

        }
    }

    useEffect(() => {
        if (params?.slug) {
            getProduct()
        }
    }, [params?.slug])

    return (
        <Layout>
            <div className="row container mt-2">
                <div className="col-md-6">
                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product?._id}`} className="card-img-top" alt={product.name} height="300" width={"450px"} />
                </div>
                <div className="col-md-6 ">
                    <h1 className='text-center'>Product Details</h1>
                    <h6>Name : {product.name} </h6>
                    <h6>Descripiton : {product.description} </h6>
                    <h6>Price : {product.price} </h6>
                    <h6>Category : {product?.category?.name} </h6>
                    <button href="#" className="btn btn-secondary ms-1">ADD TO CART</button>
                </div>
            </div>
            <hr />
            <div className="row">
                <h1>Similar Products</h1>
                {realtedProducts.length < 1 && (<p>No Similar Products found </p>)}
                <div className="d-flex flex-wrap">
                    {realtedProducts?.map((p) => (
                        <div key={p._id} className="card m-2" style={{ width: '18rem' }}>
                            <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                            <div className="card-body">
                                <h5 className="card-title">{p.name}</h5>
                                <p className="card-text">{p.description.substring(0, 3)}...</p>
                                <p className="card-text"> $ {p.price}</p>
                                <button href="#" className="btn btn-secondary ms-1">ADD TO CART</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    )
}

export default ProductDetails