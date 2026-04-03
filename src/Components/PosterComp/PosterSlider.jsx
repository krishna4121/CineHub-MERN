import React from "react";
import Slider from "react-slick";
import Poster from "./Poster";
import { NextArrowPoster, PrevArrowPoster } from "../Arrows/PosterArrow";
const PosterSlider = (props) => {
  const { posters, isDark, title, subtitle } = props;
  const setting = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 4,
    nextArrow: <NextArrowPoster />,
    prevArrow: <PrevArrowPoster />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <div className="flex flex-col items-start sm:ml-3 my-2 w-4/5 md:w-1/2">
        <h3
          className={`text-lg md:text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          {title}
        </h3>
        <p
          className={` text-xs md:text-sm  ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          {subtitle}
        </p>
      </div>
      <Slider {...setting}>
        {posters.map((each, index) => {
          return (
            <Poster {...each} isDark={isDark} key={index} linking={true} />
          );
        })}
      </Slider>
    </>
  );
};

export default PosterSlider;
