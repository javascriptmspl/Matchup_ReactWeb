import React, { Fragment, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import HeaderFour from "../../component/layout/HeaderFour";
import FooterFour from "../../component/layout/footerFour";
import del from '../assets/images/shop/del.png'
import { removeFromCartAsync, updateQuantityAsync } from "../store/slice/shop/CartSlice";


const ShopCart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.items);
    const cartItem = cartItems.length
    

    const handleRemoveFromCart = (index) => {
        dispatch(removeFromCartAsync(index));
      };

    const handleQtyChange = (index, next) => {
        const parsed = parseInt(next, 10);
        dispatch(updateQuantityAsync({ index, quantity: isNaN(parsed) ? 1 : parsed }));
    };

    const inc = (index, current) => {
        dispatch(updateQuantityAsync({ index, quantity: (current || 1) + 1 }));
    };

    const dec = (index, current) => {
        const q = Math.max(1, (current || 1) - 1);
        dispatch(updateQuantityAsync({ index, quantity: q }));
    };

    const currency = (n)=> `$${Number(n).toFixed(2)}`;
    const subtotal = useMemo(()=>{
        return cartItems.reduce((sum, it)=> sum + (Number(it.price?.toString().replace(/[^0-9.]/g,'')||0) * (Number(it.pack)||1)), 0);
    },[cartItems]);
    return (
        <Fragment>
            <HeaderFour />
            <div className="shop-cart padding-top padding-bottom">
                <div className="container">
                    <div className="section-wrapper">
                        <div className="cart-top">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="cat-product">Product</th>
                                        <th className="cat-price">Price</th>
                                        <th className="cat-quantity">Quantity</th>
                                        <th className="cat-toprice">Total</th>
                                        <th className="cat-edit">Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((val, i) => (
                                        <tr key={i}>
                                            <td className="product-item cat-product">
                                                <div className="p-thumb">
                                                    <Link to="/shop-single">
                                                        <img src={`${val.imgUrl}`} alt={`${val.imgAlt}`} />
                                                    </Link>
                                                </div>
                                                <div className="p-content">
                                                    <Link to="/shop-single">{val.title}</Link>
                                                </div>
                                            </td>
                                            <td className="cat-price">{val.price}</td>
                                            <td className="cat-quantity">
                                                <div className="cart-plus-minus">
                                                    <div className="dec qtybutton" onClick={()=>dec(i, Number(val.pack)||1)}>-</div>
                                                    <input
                                                        className="cart-plus-minus-box"
                                                        type="text"
                                                        name="qtybutton"
                                                        value={val.pack || 1}
                                                        onChange={(e)=>handleQtyChange(i, e.target.value)}
                                                    />
                                                    <div className="inc qtybutton" onClick={()=>inc(i, Number(val.pack)||1)}>+</div>
                                                </div>
                                            </td>
                                            <td className="cat-toprice">{currency((Number(val.price?.toString().replace(/[^0-9.]/g,'')||0))*(Number(val.pack)||1))}</td>
                                            <td className="cat-edit">
                                                <a href="#"  onClick={() => handleRemoveFromCart(i)} >
                                                    <img src={`${del}`} alt={`${val.delImgAlt}`} />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="cart-bottom">
                            <div className="cart-checkout-box">
                                <form className="coupon" action="/">
                                    <input type="text" name="coupon" placeholder="Coupon Code..." className="cart-page-input-text" />
                                    <button type="submit" className="default-btn ms-2 px-4"><span>Apply</span></button>
                                </form>
                                <form className="cart-checkout" action="/dating/shop-page">
                                    <button type="submit" className="default-btn m-2"><span>Update Cart</span></button>
                                    <button type="submit" className="default-btn reverse m-2"><span>Proceed to Checkout</span></button>
                                </form>
                            </div>
                            <div className="shiping-box">
                                <div className="row">
                                    <div className="col-md-6 col-12">
                                        <div className="calculate-shiping">
                                            <h3>Calculate Shipping</h3>
                                            <div className="outline-select">
                                                <select>
                                                    <option>United Kingdom (UK)</option>
                                                    <option>Bangladesh</option>
                                                    <option>Pakisthan</option>
                                                    <option>India</option>
                                                    <option>Nepal</option>
                                                </select>
                                                <span className="select-icon"><i className="icofont-rounded-down"></i></span>
                                            </div>
                                            <div className="outline-select shipping-select">
                                                <select>
                                                    <option>State/Country</option>
                                                    <option>Dhaka</option>
                                                    <option>Benkok</option>
                                                    <option>Kolkata</option>
                                                    <option>Kapasia</option>
                                                </select>
                                                <span className="select-icon"><i className="icofont-rounded-down"></i></span>
                                            </div>
                                            <input type="text" name="coupon" placeholder="Postcode/ZIP" className="cart-page-input-text" />
                                            <button type="submit" className="default-btn reverse"><span>Update Total</span></button>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <div className="cart-overview">
                                            <h3>Cart Totals</h3>
                                            <ul className="codex">
                                                <li>
                                                    <span className="pull-left">Cart Subtotal</span>
                                                    <p className="pull-right">{currency(subtotal)}</p>
                                                </li>
                                                <li>
                                                    <span className="pull-left">Shipping and Handling</span>
                                                    <p className="pull-right">Free Shipping</p>
                                                </li>
                                                <li>
                                                    <span className="pull-left">Order Total</span>
                                                    <p className="pull-right">{currency(subtotal)}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FooterFour />
        </Fragment>
    );
};

export default ShopCart;
