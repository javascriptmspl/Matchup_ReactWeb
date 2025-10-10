import { Component, Fragment, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper";

import PageHeader from "../component/layout/pageheader";
import Rating from "../component/section/rating";
import SearchBar from "../component/sidebar/search";
import Categorie from "../component/sidebar/categorie";
import RecentProduct from "../component/sidebar/recent-product";
import FooterThree from "../component/layout/footerthree";
import HeaderTwo from "../component/layout/headertwo";
import HeaderFour from "../../component/layout/HeaderFour";
import FooterFour from "../../component/layout/footerFour";

// images for female--------------------------

import imgf2 from "../../assets/images/member/home2/project-pic-female/1.png";
import imgf3 from "../../assets/images/member/home2/project-pic-female/2.png";
import imgf4 from "../../assets/images/member/home2/project-pic-female/3.png";
import imgf5 from "../../assets/images/member/home2/project-pic-female/4.png";
import imgf6 from "../../assets/images/member/home2/project-pic-female/5.png";
import imgf7 from "../../assets/images/member/home2/project-pic-female/6.png";
import imgf8 from "../../assets/images/member/home2/project-pic-female/7.png";
import imgf9 from "../../assets/images/member/home2/project-pic-female/8.png";
import imgf10 from "../../assets/images/member/home2/project-pic-female/9.png";
import imgf1 from "../../assets/images/member/home2/project-pic-female/10.png";


// images for male----------------------------
import imgm1 from "../../assets/images/member/home2/project-pic-male/1.png";
import imgm2 from "../../assets/images/member/home2/project-pic-male/2.png";
import imgm3 from "../../assets/images/member/home2/project-pic-male/3.png";
import imgm4 from "../../assets/images/member/home2/project-pic-male/4.png";
import imgm5 from "../../assets/images/member/home2/project-pic-male/5.png";
import imgm6 from "../../assets/images/member/home2/project-pic-male/6.png";
import imgm7 from "../../assets/images/member/home2/project-pic-male/7.png";
import imgm8 from "../../assets/images/member/home2/project-pic-male/8.png";
import imgm9 from "../../assets/images/member/home2/project-pic-male/9.png";
import imgm10 from "../../assets/images/member/home2/project-pic-male/10.png";


import img1 from "../assets/images/shop/dating/1.jpg";
import img2 from "../assets/images/shop/dating/2.jpg";
import img3 from "../assets/images/shop/dating/3.jpg";
import img4 from "../assets/images/shop/dating/4.jpg";
import img5 from "../assets/images/shop/dating/5.jpg";
import img6 from "../assets/images/shop/dating/6.jpg";
import img7 from "../assets/images/shop/dating/7.jpg";
import img8 from "../assets/images/shop/dating/8.jpg";
import img9 from "../assets/images/shop/dating/9.jpg";
import { useParams } from "react-router-dom";
import { addToCartAsync } from "../store/slice/shop/CartSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const title = "The Title here";
const subtitle = "Product Description";
const price = "$ 340.00";
const desc =
  "Energistia an deliver atactica metrcs after avsionary Apropria trnsition enterpris an sources applications emerging 	psd template.";
const reviwtitle = "Add a Review";

let ProductList = [
  {
    id: 1,
    imgUrl: img1,
    imgAlt: "Product Thumb",
    pack: "100",
    title: "T-Shirt",
    price: "$44.00",
    desc: "High-quality T-Shirt made from premium materials. ",
  },
  {
    id: 2,
    imgUrl: img2,
    imgAlt: "Product Thumb",
    pack: "100",
    title: "Heart",
    price: "$77.00",
    desc: "Lovely heart-shaped product perfect for special occasions. Express your love with this unique item.",
  },
  {
    id: 3,
    imgUrl: img3,
    imgAlt: "Product Thumb",
    title: "Princess Crown",
    pack: "100",
    price: "$34.00",
    desc: "Beautiful Princess Crown for a touch of royalty. Ideal for themed events.",
  },
  {
    id: 4,
    imgUrl: img4,
    imgAlt: "Product Thumb",
    title: "Special Balloons",
    price: "$19.00",
    desc: "Colorful and fun Special Balloons for any celebration. Bring joy to your events.",
  },
  {
    id: 5,
    imgUrl: img5,
    imgAlt: "Product Thumb",
    title: "Hot Coffee",
    pack: "100",
    price: "$75.00",
    desc: "Premium Hot Coffee for coffee enthusiasts. Enjoy a rich and aromatic cup.",
  },
  {
    id: 6,
    imgUrl: img6,
    imgAlt: "Product Thumb",
    title: "Christmas Tree",
    pack: "100",
    price: "$13.00",
    desc: "Festive Christmas Tree to brighten up your holidays. Create magical memories.",
  },
  {
    id: 7,
    imgUrl: img7,
    imgAlt: "Product Thumb",
    title: "Beer Party",
    pack: "100",
    price: "$99.00",
    desc: "The Beer Party package is the perfect gift for any beer enthusiast! Curated selection of premium beers.",
  },
  {
    id: 8,
    imgUrl: img8,
    imgAlt: "Product Thumb",
    title: "Blue Butterflies",
    pack: "100",
    price: "$10.00",
    desc: "Blue Butterflies to add a touch of nature. Ideal for decorating.",
  },
  {
    id: 9,
    imgUrl: img9,
    imgAlt: "Product Thumb",
    title: "Engagement Ring",
    pack: "100",
    price: "$18.00",
    desc: "Elegant Engagement Ring for a special moment. Symbolize your commitment.",
  },
];

let ReviewList = [
  {
    imgUrl: imgm3,
    imgAlt: "Client thumb",
    name: "Alexander Brown",
    date: "Posted on May 25, 2022 at 6:57 am",
    desc: "This product exceeded my expectations! The quality is superb, and it is incredibly user-friendly. I can not imagine my life without it now.",
    desc2:
      "'The Beer Party' package is the perfect gift for any beer enthusiast! With a carefully curated selection of premium beers from around the world, this package guarantees a delightful beer-tasting experience. Whether you are celebrating a special occasion or simply want to surprise a friend, the Beer Party gift is a great choice.\n\nWhy you should buy:\n- Diverse Beer Selection: Explore a variety of beer styles and flavors.\n- High-Quality Brews: Each beer is carefully selected for its quality and taste.\n- Perfect for Celebrations: Ideal for birthdays, anniversaries, or any festive occasion.\n\nHow to gift:\n1. Select the 'Beer Party' package and proceed to checkout.\n2. Add a personalized message during the checkout process.\n3. Provide the recipient's address for direct delivery.\n4. Surprise your loved one with a fantastic beer-tasting experience!",
  },
  {
    imgUrl: imgf8,
    imgAlt: "Client thumb",
    name: "Emma Davis",
    date: "Posted on May 25, 2022 at 6:57 am",
    desc: "Five stars all the way! This product is a game-changer. It's durable, efficient, and delivers exceptional performance. Worth every penny!",
  },
  {
    imgUrl: imgm6,
    imgAlt: "Client thumb",
    name: "Telford Bois",
    date: "Posted on December 25, 2022 at 6:57 am",
    desc: "I've tried several similar products, but this one stands out. The design is sleek, and the functionality is top-notch. I highly recommend it to anyone in need of a reliable solution.",
  },
  {
    imgUrl: imgf4,
    imgAlt: "Client thumb",
    name: "Zinat Zaara",
    date: "Posted on December 25, 2022 at 6:57 am",
    desc: "Incredible product! The features are impressive, and it's remarkably easy to use. It has become an essential part of my daily routine, and I can't imagine going back to life without it.",
  },
];

const ShopDetails = () => {
  const [product, setProduct] = useState(null);
  const [OneProduct, setOneProduct] = useState(null);
  const [state, setState] = useState({
    reviwName: "",
    reviwEmail: "",
    reviwMassage: "",
  });

  const dispatch = useDispatch();

  const reviewShow = () => {
    document
      .querySelector(".review-content")
      .classList.add("review-content-show");
    document
      .querySelector(".review-content")
      .classList.remove("description-show");
    document.querySelector(".review-nav").classList.add("RevActive");
    document.querySelector(".review-nav").classList.remove("DescActive");
  };

  const descriptionShow = () => {
    document.querySelector(".review-content").classList.add("description-show");
    document
      .querySelector(".review-content")
      .classList.remove("review-content-show");
    document.querySelector(".review-nav").classList.add("DescActive");
    document.querySelector(".review-nav").classList.remove("RevActive");
  };

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCartAsync(product));
      toast.success(`${product.title} added to cart!`);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const productId = parseInt(queryParams.get("parmId"), 10);

    const filteredProducts = ProductList.filter(
      (item) => item.id === productId
    );

    if (filteredProducts.length > 0) {
      setOneProduct(filteredProducts);
      setProduct(filteredProducts[0]);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      reviwName: "",
      reviwEmail: "",
      reviwMassage: "",
      
    },
    validationSchema: Yup.object({
      reviwName: Yup.string().required("Full Name is required"),
      reviwEmail: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      reviwMassage: Yup.string().required("Feedback comment is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
        if (Object.keys(formik.errors).length === 0) {
          toast.success('Review submitted successfully!'); 
          await resetForm();
        } else {
          setSubmitting(false);
          toast.error('Please fill in all required fields.');
        }
      },
    });

  return (
    <Fragment>
      <HeaderFour />
      <div className="shop-single padding-top padding-bottom aside-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9 col-12">
              <article>
                <div className="product-details">
                  <div className="row align-items-center">
                    <div className="col-md-6 col-12">
                      <div className="product-thumb">
                        <div className="swiper-container pro-single-top">
                          <Swiper
                            spaceBetween={30}
                            slidesPerView={1}
                            loop={"true"}
                            autoplay={{
                              delay: 5000,
                              disableOnInteraction: false,
                            }}
                            navigation={{
                              prevEl: ".pro-single-prev",
                              nextEl: ".pro-single-next",
                            }}
                            modules={[Autoplay, Navigation]}
                          >
                            {OneProduct &&
                              OneProduct.map((val, i) => (
                                <SwiperSlide key={i}>
                                  <div className="single-thumb">
                                    <img
                                      src={`${val.imgUrl}`}
                                      alt={`${val.imgAlt}`}
                                    />
                                  </div>
                                </SwiperSlide>
                              ))}
                          </Swiper>
                          <div className="pro-single-next">
                            <i className="icofont-rounded-left"></i>
                          </div>
                          <div className="pro-single-prev">
                            <i className="icofont-rounded-right"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    {OneProduct &&
                      OneProduct.map((val, i) => (
                        <div className="col-md-6 col-12">
                          <div className="post-content">
                            <h4>{`${val.title}`}</h4>
                            <p className="rating">
                              <i className="icofont-star"></i>
                              <i className="icofont-star"></i>
                              <i className="icofont-star"></i>
                              <i className="icofont-star"></i>
                              <i className="icofont-star"></i>
                              (3 review)
                            </p>
                            <h4>{`${val.price}`}</h4>
                            <h6>{subtitle}</h6>
                            <p>{val.desc}</p>
                            <form>
                              <div className="select-product size">
                                <select>
                                  <option>Select Size</option>
                                  <option>SM</option>
                                  <option>MD</option>
                                  <option>LG</option>
                                  <option>XL</option>
                                  <option>XXL</option>
                                </select>
                                <i className="icofont-rounded-down"></i>
                              </div>
                              <div className="select-product color">
                                <select>
                                  <option>Select Color</option>
                                  <option>Pink</option>
                                  <option>Ash</option>
                                  <option>Red</option>
                                  <option>White</option>
                                  <option>Blue</option>
                                </select>
                                <i className="icofont-rounded-down"></i>
                              </div>
                              <div className="cart-plus-minus">
                                <div className="dec qtybutton">-</div>
                                <input
                                  className="cart-plus-minus-box"
                                  type="text"
                                  value="1"
                                />
                                <div className="inc qtybutton">+</div>
                              </div>
                              <div className="discount-code">
                                <input
                                  type="text"
                                  placeholder="Enter Discount Code"
                                />
                              </div>
                              <button
                                onClick={handleAddToCart}
                                type="submit"
                                className="default-btn"
                              >
                                <span>Add To Cart</span>
                              </button>
                            </form>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="review">
                  <ul className="review-nav RevActive lab-ul">
                    <li
                      onClick={descriptionShow}
                      className="desc"
                      data-target="description-show"
                    >
                      Description
                    </li>
                    <li
                      onClick={reviewShow}
                      className="rev"
                      data-target="review-content-show"
                    >
                      Reviews 4
                    </li>
                  </ul>
                  <div className="review-content review-content-show">
                    <div className="review-showing">
                      <ul className="content lab-ul">
                        {ReviewList.map((val, i) => (
                          <li key={i}>
                            <div className="post-thumb">
                              <img
                                src={`${val.imgUrl}`}
                                alt={`${val.imgAlt}`}
                              />
                            </div>
                            <div className="post-content">
                              <div className="entry-meta">
                                <div className="posted-on">
                                  <a href="#">{val.name}</a>
                                </div>
                                <div className="rating">
                                  <i className="icofont-star"></i>
                                  <i className="icofont-star"></i>
                                  <i className="icofont-star"></i>
                                  <i className="icofont-star"></i>
                                  <i className="icofont-star"></i>
                                </div>
                              </div>
                              <div className="entry-content">
                                <p className="text-muted text-start">
                                  {val.desc}{" "}
                                  <small className="text-muted float-end">
                                    {val.date}
                                  </small>
                                </p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="client-review">
                        <div className="review-form">
                          <div className="review-title">
                            <h5>{reviwtitle}</h5>
                          </div>
                          <form onSubmit={formik.handleSubmit} action="action" className="row">
                            <div className="col-md-4 col-12">
                              <input
                                type="text"
                                name="reviwName"
                                id="item01"
                                value={formik.values.reviwName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Full Name *"
                              />
                              {formik.touched.reviwName &&
                              formik.errors.reviwName ? (
                                <div style={{ color: 'red' }} className="error">
                                  {formik.errors.reviwName}
                                </div>
                              ) : null}
                            </div>
                            <div className="col-md-4 col-12">
                            <input
                        type="text"
                        name="reviwEmail"
                        id="item02"
                        value={formik.values.reviwEmail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Your Email *"
                    />
                    {formik.touched.reviwEmail && formik.errors.reviwEmail ? (
                        <div style={{ color: 'red' }} className="error">{formik.errors.reviwEmail}</div>
                    ) : null}
                            </div>
                            <div className="col-md-4 col-12">
                              <div className="rating">
                                <span className="rating-title">
                                  Your Rating :{" "}
                                </span>
                                <Rating />
                              </div>
                            </div>
                            <div className="col-md-12 col-12">
                              <textarea
                                rows="8"
                                type="text"
                                id="item03"
                                name="reviwMassage"
                                value={formik.values.reviwMassage}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Type Here Message"
                              />
                                {formik.touched.reviwMassage && formik.errors.reviwMassage ? (
                        <div style={{ color: 'red' }} className="error">{formik.errors.reviwMassage}</div>
                    ) : null}
                            
                            </div>
                            <div className="col-12">
                              <button className="default-btn" type="submit">
                                <span>Submit Review</span>
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                    <div className="description">
                      <p>
                        "'The Beer Party' package is the perfect gift for any
                        beer enthusiast! With a carefully curated selection of
                        premium beers from around the world, this package
                        guarantees a delightful beer-tasting experience. Whether
                        you are celebrating a special occasion or simply want to
                        surprise a friend, the Beer Party gift is a great
                        choice.\n\nWhy you should buy:\n- Diverse Beer
                        Selection: Explore a variety of beer styles and
                        flavors.\n- High-Quality Brews: Each beer is carefully
                        selected for its quality and taste.\n- Perfect for
                        Celebrations: Ideal for birthdays, anniversaries, or any
                        festive occasion.\n\nHow to gift:\n1. Select the 'Beer
                        Party' package and proceed to checkout.\n2. Add a
                        personalized message during the checkout process.\n3.
                        Provide the recipient's address for direct delivery.\n4.
                        Surprise your loved one with a fantastic beer-tasting
                        experience!",
                      </p>
                      <div className="post-item py-4">
                        <div className="post-thumb">
                          <img src="assets/images/shop/01.jpg" alt="shop" />
                        </div>
                        <div className="post-content">
                          <ul className="lab-ul">
                            <li>Donec non est at libero vulputate rutrum.</li>
                            <li>
                              Morbi ornare lectus quis justo gravida semper.
                            </li>
                            <li>
                              Pellentesque aliquet, sem eget laoreet ultrices.
                            </li>
                            <li>
                              Nulla tellus mi, vulputate adipiscing cursus eu,
                              suscipit id nulla.
                            </li>
                            <li>Donec a neque libero.</li>
                            <li>
                              Pellentesque aliquet, sem eget laoreet ultrices.
                            </li>
                            <li>
                              Morbi ornare lectus quis justo gravida semper..
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex
                        ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum.
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
            <div className="col-lg-3 col-md-7 col-12">
              <aside>
                <SearchBar />
                <Categorie />
                <RecentProduct />
              </aside>
            </div>
          </div>
        </div>
      </div>
      <FooterFour />
    </Fragment>
  );
};

export default ShopDetails;
