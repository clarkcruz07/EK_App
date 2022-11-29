import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export const Header = () =>{
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
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
                                <div className="slick-content base-text">By using this smartlocker, you agree to QUBE's Terms & Agreement and Privacy Policy</div>
                            </div>
                            <div>
                                <p className="base-color">Privacy Policy</p>
                                <div className="slick-content base-text">By using this smartlocker, you agree to QUBE's Terms & Agreement and Privacy Policy</div>
                            </div>
                            <div>
                                <p className="base-color">Privacy Policy</p>
                                <div className="slick-content base-text">By using this smartlocker, you agree to QUBE's Terms & Agreement and Privacy Policy</div>
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