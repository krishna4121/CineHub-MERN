import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";

const StreamPoster = (movie) => {
  const Vote = movie.vote_average;
  const Overviews = movie.overview;

  return (
    <>
      <Link to={`/movie/${movie.id}`}>
        <div className="relative w-auto h-60 md:h-110">
          <div
            className="absolute z-20 w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg,rgb(34,34,34,0.7),rgb(34,34,34,0.9) 3%,rgb(34,34,34) 6%, rgb(34,34,34) 24.95%, rgb(34,34,34) 30.2%, rgba(34,34,34,0.03) 97.47%, rgb(34, 34, 34) 100%)",
            }}
          >
            <div className="absolute z-30 left-4 md:left-12 top-5 md:top-9 flex itmes-center gap-10">
              <div className="w-2/12 md:w-3/12 h-auto">
                <div className="w-32 mt-2 md:mt-0 h-44 md:w-64 md:h-96">
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                    alt="Movie Poster"
                    className="w-full h-full rounded-lg"
                  ></img>
                </div>
              </div>
              <div className="flex items-center ps-10 md:ps-0 w-10/12 md:w-9/12">
                <div className="w-10/12 md:w-11/12">
                  <h1 className="text-white text-lg md:text-4xl font-bold ">
                    {movie.original_title}
                  </h1>
                  <div className="text-white flex flex-col gap-1 md:gap-3">
                    <div className="flex items-end gap-2 pt-3 md:pt-7">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 md:w-7 md:h-7 ">
                          <FaStar className="w-full h-full text-red-500" />
                        </span>
                        <h4 className="text-sm md:text-2xl font-semibold">
                          {Vote !== undefined ? Vote.toFixed(1) : "N/A"}/10
                        </h4>
                      </div>
                      <h4 className="text-xs">{movie.vote_count} votes</h4>
                    </div>
                    <div className="pt-1 md:pt-3 w-full">
                      <p className="pb-0.5 text-sm rounded-sm md:text-base truncate-lines-3">
                        Overview : {Overviews}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt="BackDrop Poster"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </Link>
    </>
  );
};

export default StreamPoster;
