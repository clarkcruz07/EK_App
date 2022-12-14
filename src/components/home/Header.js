import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export const Header = () =>{
    var settings = {
        dots: true,
        infinite: true,
        speed: 3000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 10000,
        draggable: true
      };
    return (
        <div className="row">
           <div className="panel panel-default mb-5 bg-white w-80 mx-auto rounded-big  mt-5 footer">
                <div className="panel-body p-3">
                    <div className="text-dark">
                        {/* slick */ }
                        <Slider {...settings}>
                            <div>
                                <p className="base-color">Privacy Policy</p>
                                <div className="slick-content base-text">By using this smartlocker, you agree to QUBE's <strong>Terms of Use</strong> and <strong>Privacy Policy</strong></div>
                            </div>
                            <div>
                                <p className="base-color">QUBE 24/7 Support</p>
                                <div className="slick-content base-text">For concerns and inquiries, contact our customer support at <strong> 09176320343 / 09171292877 </strong> or <strong>support@qubesmart360.com</strong></div>
                            </div>
                            <div>
                                <p className="base-color">Using locker to play or go home?</p>
                                <div className="slick-content base-text">You have unlimited re-opens for your lockers. Only choose <strong>"Going Home"</strong> option when you are about to leave EK.</div>
                            </div>
                            
                        </Slider>
                    </div>
                    <div className="d-flex justify-content-around align-items-center">
                       
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header