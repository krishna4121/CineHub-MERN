import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingContext } from "../Context/LoagindContext";
import { MovieContext } from "../Context/MovieContext";
import { FaCcVisa, FaCcApplePay } from "react-icons/fa";
import PosterSlider from "../Components/PosterComp/PosterSlider";
import Slider from "react-slick";
import Cast from "../Components/Cast/CastComp";
import DefaultLayout from "../Layouts/DefaultLayout";
import MovieHeroComp from "../Components/MovieHero/MovieHeroComp";
import { HashLoader } from "react-spinners";
import {
  NextArrowPoster,
  PrevArrowPoster,
} from "../Components/Arrows/PosterArrow";
import api from "../lib/api";

const MoviePage = () => {
  const { movie, setMovie } = useContext(MovieContext);
  const { id } = useParams();
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [recommdenedMovies, setRecommendedMovies] = useState([]);
  const { loading, setloading } = useContext(LoadingContext);

  useEffect(() => {
    let ignore = false;

    const loadMovie = async () => {
      setloading(true);

      try {
        const response = await api.get(`/content/movies/${id}`);

        if (ignore) {
          return;
        }

        setMovie(response.data.movie || {});
        setCast(response.data.cast || []);
        setSimilarMovies(response.data.similar || []);
        setRecommendedMovies(response.data.recommendations || []);
      } catch (error) {
        console.log(error.message);
      } finally {
        if (!ignore) {
          setloading(false);
        }
      }
    };

    loadMovie();

    return () => {
      ignore = true;
    };
  }, [id, setMovie, setloading]);

  const settingCast = {
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: <NextArrowPoster />,
    prevArrow: <PrevArrowPoster />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToScroll: 4,
          slidesToShow: 3,
          initialSlide: 0,
        },
      },
    ],
  };

  const settings = {
    infinite: false,
    speed: 500,
    slidesToScroll: 4,
    slidesToShow: 4,
    initialSlide: 0,
    nextArrow: <NextArrowPoster />,
    prevArrow: <PrevArrowPoster />,
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

  return (
    <>
      {loading ? (
        <div
          className="flex items-center w-full justify-center"
          style={{ height: "85vh" }}
        >
          <HashLoader
            className="mb-28 md:mb-32"
            color="#e33030"
            speedMultiplier={2}
          />
        </div>
      ) : (
        <>
          <MovieHeroComp />

          <div className="my-6 md:my-12 px-4 lg:ml-20 lg:w-2/1">
            <div className="flex flex-col items-start gap-1 md:gap-3">
              <h1 className="text-gray-800 font-bold gap-3 text-xl md:text-2xl">
                About the movie
              </h1>
              <p className="text-xs md:text-base">{movie.overview}</p>
            </div>

            <div className="my-3 md:my-8">
              <hr />
            </div>

            <div className="my-3 md:my-8">
              <h2 className="text-gray-800 font-bold text-xl md:text-2xl mb-3">
                Applicable Offers
              </h2>
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="flex items-start gap-2 bg-yellow-100 p-3 border-yellow-400 border-dashed border-2 rounded-md">
                  <div className="w-8 h-8">
                    <FaCcVisa className="w-full h-full" />
                  </div>
                  <div>
                    <h3 className="text-gray-700 text-base md:text-xl font-bold">
                      Visa Stream Offer
                    </h3>
                    <p className="text-gray-600 text-xs md:text-base">
                      Get 75% off up to INR 200 on all RuPay Card* on BookMyShow
                      Stream
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 border-2 border-dashed border-yellow-400 rounded-md bg-yellow-100">
                  <div className="w-8 h-8">
                    <FaCcApplePay className="w-full h-full" />
                  </div>
                  <div className="flex flex-col items-start">
                    <h3 className="text-gray-700 text-base md:text-xl font-bold">
                      Film Pass
                    </h3>
                    <p className="text-gray-600 text-xs md:text-base">
                      Get 75% off up to INR 200 on all RuPay Card* on BookMyShow
                      Stream
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="my-3 md:my-8">
              <hr />
            </div>

            {/* Cast Sliders  */}
            <div className="my-3 md:my-8 overflow-hidden">
              <h2 className="text-gray-800 font-bold text-lg md:text-2xl mb-2 md:mb-4">
                Cast and Crew
              </h2>
              <Slider {...settingCast}>
                {cast.map((castData) => {
                  return (
                    <Cast
                      key={`${castData.cast_id || castData.id}-${castData.name}`}
                      image={castData.profile_path}
                      castName={castData.original_name}
                      role={castData.character}
                    />
                  );
                })}
              </Slider>
            </div>

            <div className="my-3 md:my-8">
              <hr />
            </div>

            {/* Recommended Sliders  */}
            <div className="my-3 md:my-8 overflow-hidden">
              <PosterSlider
                config={settings}
                title="Recommended Movies"
                posters={recommdenedMovies}
                isDark={false}
              />
            </div>

            <div className="my-3 md:my-8">
              <hr />
            </div>

            <div className="overflow-hidden mb-16">
              <PosterSlider
                config={settings}
                title="BMS XCLUSIVE Movies"
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

export default DefaultLayout(MoviePage);
