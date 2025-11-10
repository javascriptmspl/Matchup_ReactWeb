import React, { useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../component/section/pagination";
import Rating from "../component/section/rating";
import Categorie from "../component/sidebar/categorie";
import RecentProduct from "../component/sidebar/recent-product";
import SearchBar from "../component/sidebar/search";
import HeaderFour from "../../component/layout/HeaderFour";
import FooterFour from "../../component/layout/footerFour";



import img1 from '../assets/images/shop/dating/1.jpg'
import img2 from '../assets/images/shop/dating/2.jpg'
import img3 from '../assets/images/shop/dating/3.jpg'
import img4 from '../assets/images/shop/dating/4.jpg'
import img5 from '../assets/images/shop/dating/5.jpg'
import img6 from '../assets/images/shop/dating/6.jpg'
import img7 from '../assets/images/shop/dating/7.jpg'
import img8 from '../assets/images/shop/dating/8.jpg'
import img9 from '../assets/images/shop/dating/9.jpg'
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync, cartReducer } from "../store/slice/shop/CartSlice";
import toast from "react-hot-toast";
import { Badge } from "react-bootstrap";
const showResult = "Showing 01 - 12 of 139 Results";

let ProductList = [
    {
        id: 1,
        imgUrl: img1,
        imgAlt: 'Product Thumb',
        pack: '100',
        title: 'T-Shirt',
        price: '$200.00',
        desc: 'High-quality T-Shirt made from premium materials. Discover the perfect blend of style and comfort with our exclusive collection of T-shirts. Elevate your wardrobe with premium fabrics, trendy designs, and impeccable craftsmanship. ',
    },
    {
        id: 2,
        imgUrl: img2,
        imgAlt: 'Product Thumb',
        pack: '100',
        title: 'Heart',
        price: '$200.00',
        desc: 'Lovely heart-shaped product perfect for special occasions. Express your love with this unique item.',
    },
    {
        id: 3,
        imgUrl: img3,
        imgAlt: 'Product Thumb',
        title: 'Princess Crown',
        pack: '100',
        price: '$200.00',
        desc: 'Beautiful Princess Crown for a touch of royalty. Ideal for themed events.your special moments with a touch of royal splendor. Choose from a range of designs fit for kings and queens, making every celebration a majestic affair.',
    },
    {
        id: 4,
        imgUrl: img4,
        imgAlt: 'Product Thumb',
        title: 'Special Ballons',
        price: '$200.00',
        desc: 'Colorful and fun Special Balloons for any celebration. Bring joy to your events.From vibrant colors to unique shapes, our balloons add a touch of magic to celebrations.',
    },
    {
        id: 5,
        imgUrl: img5,
        imgAlt: 'Product Thumb',
        title: 'Hot Coffie',
        pack: '100',
        price: '$200.00',
        desc: 'Premium Hot Coffee for coffee enthusiasts. Enjoy a rich and aromatic cup.Designed for comfort and style, these cups are the perfect companions for your favorite brew, ensuring every sip is a moment of pure delight. ',
    },
    {
        id: 6,
        imgUrl: img6,
        imgAlt: 'Product Thumb',
        title: 'Christmas Tree',
        pack: '100',
        price: '$200.00',
        desc: 'Festive Christmas Tree to brighten up your holidays. Create magical memories.Christmas trees, meticulously selected for their lush greenery and symmetrical branches. Elevate your holiday celebrations with our premium trees.',
    },
    {
        id: 7,
        imgUrl: img7,
        imgAlt: 'Product Thumb',
        title: 'Beer Party',
        pack: '100',
        price: '$200.00',
        desc: 'The Beer Party package is the perfect gift for any beer enthusiast! Curated selection of premium beers.Elevate your gatherings with a touch of cheer and camaraderie. Crafted for those who savor the moments, this tag is the perfect addition to your celebration essentials.',
    },
    {
        id: 8,
        imgUrl: img8,
        imgAlt: 'Product Thumb',
        title: 'Blue Butterflies',
        pack: '100',
        price: '$200.00',
        desc: 'Blue Butterflies to add a touch of nature. Ideal for decorating.Transform your space with the enchanting allure of Blue Butterflies. Our exquisite collection of vibrant and delicate blue-winged beauties adds a touch of natures elegance to any setting. ',
    },
    {
        id: 9,
        imgUrl: img9,
        imgAlt: 'Product Thumb',
        title: 'Engagement Ring',
        pack: '100',
        price: '$200.00',
        desc: 'Elegant Engagement Ring for a special moment. Symbolize your commitment.Discover timeless elegance with our exquisite collection of engagement rings. Each ring is meticulously crafted to symbolize the eternal bond of love, featuring stunning diamonds set in impeccable designs',
    },
];



const ShopPage = () => {
    const [viewMode, setViewMode] = useState('grid');
   
    const setGridView = () => setViewMode('grid');
    const setListView = () => setViewMode('list');

    const dispatch = useDispatch(); 
    const cartItems = useSelector((state) => state.cart.items);
    const cartItem = cartItems.length

    const handleAddToCart = (product) => {  
        dispatch(addToCartAsync(product))
            .then(() => {
                toast.success(`${product.title} added to cart!`)
            })
            .catch((error) => {
                console.error('Failed to add product to cart:', error);
            });
    };
    return (
        <>
            <HeaderFour />
            <div className="shop-page padding-top padding-bottom aside-bg">
                <div className="container">
                    <div className="row justify-content-center pb-15">
                        <div className="col-lg-9 col-12">
                            <article>
                                <div className="row ">
                                    <div className="col-12 shop-title d-flex flex-wrap  justify-content-between">
                                        <p>{showResult}</p>
                                        <div className={`product-view-mode ${viewMode === 'grid' ? 'gridActive' : 'listActive'}`}>
                                            <a className="grid pe-1" onClick={setGridView}><i className=" fs-2 icofont-ghost"></i></a>
                                            <a className="list pe-1" onClick={setListView}><i className=" fs-2    icofont-listine-dots"></i></a>
                                            <Link className="" to="/dating/shop-cart">
                                            <i className=" fs-2 fa fa-shopping-cart" aria-hidden="true">
                                            </i>
                                            <Badge bg="danger  custom-badge">{cartItem}</Badge>
                                        </Link>
                                        </div>
                                    </div>
                                   
                                </div>
                                <div className={`shop-product-wrap ${viewMode === 'grid' ? 'grid' : 'list'} row justify-content-center g-4`}>
                                    {ProductList.map((val, i, product) => (
                                        <div className="col-lg-4 col-md-6 col-12" key={i}>
                                            <div className="product-item">
                                                <div className="product-thumb">
                                                    <div className="pro-thumb">
                                                        <img src={val.imgUrl} alt={val.imgAlt} />
                                                    </div>
                                                    <div className="product-action-link" style={{ justifyContent: "center" }}>
                                                        <Link to={`/dating/shop-single?parmId=${val.id}` }><i className="icofont-eye"></i></Link>
                                                        <Link to="#"><i className="icofont-heart"></i></Link>
                                                        <Link onClick={() => handleAddToCart(val)} to="#"><i className="icofont-cart-alt"></i></Link>
                                                    </div>
                                                </div>
                                                <div className="product-content">
                                                    <h5>{val.title} <br /> <small style={{}}>{`pack of ${val.pack}`}</small></h5>
                                                    <div className="productRating"><Rating /></div>
                                                    <h6>{val.price}</h6>
                                                </div>
                                            </div>
                                            {viewMode === 'list' && (
                                                <div className="product-list-item">
                                                    <div className="product-thumb">
                                                        <div className="">
                                                            <img src={val.imgUrl} alt={val.imgAlt} />
                                                        </div>
                                                       
                                                    </div>
                                                    <div className="product-content">
                                                        <h5><a href="#">{val.title}</a></h5>
                                                        <div className="productRating"><Rating /></div>
                                                        <h6>{val.price}</h6>
                                                        <p>{val.desc}</p>
                                                        
                                                        <div className="product-action-link  " style={{justifyContent:"space-between" ,fontSize:"xx-large", marginTop: "20px" }}>
                                                        <Link to={`/dating/shop-single?parmId=${val.id}`} style={{ marginRight: "10px" }}><i className="icofont-eye"></i></Link>
                                                        <Link to="#"style={{ marginRight: "10px" }}><i className="icofont-heart"></i></Link>
                                                        <Link onClick={() => handleAddToCart(val)} to="#"><i className="icofont-cart-alt"></i></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <Pagination />
                            </article>
                        </div>
                        {/* <div className="col-lg-3 col-md-7 col-12">
                            <aside>
                                <SearchBar />
                                <Categorie />
                                <RecentProduct />
                            </aside>
                        </div> */}
                    </div>
                </div>
            </div>
            <FooterFour />
        </>
    );
};

export default ShopPage;
