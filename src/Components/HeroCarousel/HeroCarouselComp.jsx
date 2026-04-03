import React from "react";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "./ArrowComp";

const HeroCarousel = () => {
  const images = [
    "https://assets-in.bmscdn.com/promotions/cms/creatives/1709551304573_webbanner2.jpg",
    "https://assets-in.bmscdn.com/promotions/cms/creatives/1706382336630_web.jpg",
    "https://assets-in.bmscdn.com/promotions/cms/creatives/1709889594064_freeaccessweb.jpg",
    // "https://assets-in.bmscdn.com/promotions/cms/creatives/1709100065764_desktopsgdiysdgisd.jpg",
    "https://assets-in.bmscdn.com/promotions/cms/creatives/1709298411305_sominithingsaiyyoshraddhaworldtour2024web.jpg",
    "https://in.bmscdn.com/webin/best-of-2018/best-of-2018-banner.jpg",
    "https://assets-in.bmscdn.com/promotions/cms/creatives/1709551322766_webbanner3.jpg",
  ];

  const settingLG = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 180,
    slideToScroll: 1,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
    <>
      <div>
        <Slider {...settingLG}>
          {images.map((each, index) => {
            return (
              <div className="w-full h-48 md:h-80 px-2 py-3" key={index}>
                <img
                  src={each}
                  alt="Hero Banner"
                  className="w-full h-full rounded-lg object-cover"
                ></img>
              </div>
            );
          })}
        </Slider>
      </div>
    </>
  );
};

export default HeroCarousel;
