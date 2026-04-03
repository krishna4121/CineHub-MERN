import React, { useEffect, useState, useContext } from "react";
import PosterSlider from "../Components/PosterComp/PosterSlider";
import Slider from "react-slick";
import StreamPoster from "../Components/PosterComp/StreamPoster";
import { NextArrow, PrevArrow } from "../Components/HeroCarousel/ArrowComp";
import DefaultLayout from "../Layouts/DefaultLayout";
import { LoadingContext } from "../Context/LoagindContext";
import { PropagateLoader } from "react-spinners";
import api from "../lib/api";

const StreamPage = () => {
  const [similarMovies, setSimilarMovies] = useState([]);
  const [recommdenedMovies, setRecommendedMovies] = useState([]);
  const { loading, setloading } = useContext(LoadingContext);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToScroll: 4,
    slidesToShow: 4,
    initialSlide: 5,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToScroll: 4,
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToScroll: 2,
          slidesToShow: 2,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToScroll: 1,
          slidesToShow: 2,
          initialSlide: 2,
        },
      },
    ],
  };

  useEffect(() => {
    let ignore = false;

    const loadStreamContent = async () => {
      setloading(true);

      try {
        const response = await api.get("/content/stream", {
          params: { region: "IN" },
        });

        if (ignore) {
          return;
        }

        setRecommendedMovies(response.data.featured || []);
        setSimilarMovies(response.data.upcoming || []);
      } catch (error) {
        console.log(error.message);
      } finally {
        if (!ignore) {
          setloading(false);
        }
      }
    };

    loadStreamContent();

    return () => {
      ignore = true;
    };
  }, [setloading]);

  const settingStream = {
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    dots: true,
    autoplaySpeed: 1500,
    cssEase: "linear",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
    <>
      {loading ? (
        <div
          className="flex items-center w-full justify-center"
          style={{ height: "85vh" }}
        >
          <PropagateLoader className="pb-28" color="#e33030" />
        </div>
      ) : (
        <>
          {/* <div className="flex flex-col items-start sm:ml-3 my-2 w-1/2"></div> */}
          <div className="overflow-hidden mt-2">
            <Slider {...settingStream}>
              {recommdenedMovies.map((each, index) => {
                return <StreamPoster {...each} key={each.id || index} />;
              })}
            </Slider>
          </div>

          <div className="my-12 px-4 lg-ml-20 lg:w-2/1">
            <div className="my-8">
              <hr />
            </div>

            {/* Recommended Sliders  */}
            <div className="my-8 overflow-hidden">
              <PosterSlider
                config={settings}
                title="Recommended Movies"
                posters={recommdenedMovies}
                isDark={false}
              />
            </div>

            <div className="my-8">
              <hr />
            </div>

            <div className="overflow-hidden mb-16">
              <PosterSlider
                config={settings}
                title="Upcoming Releases"
                posters={similarMovies}
                isDark={false}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DefaultLayout(StreamPage);
