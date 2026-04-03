import React, { useContext, useState } from "react";
import { MovieContext } from "../../Context/MovieContext";
import MovieInfoComp from "../MovieHero/MovieInfoComp";
import PaymentModal from "../PaymentModal/PaymentComp";
import { FaStar } from "react-icons/fa6";

const MovieHeroComp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [state, setstate] = useState("");
  const { movie } = useContext(MovieContext);

  const rentmovie = () => {
    setIsOpen(true);
    setPrice(499);
    setstate("Rent");
  };

  const buymovie = () => {
    setIsOpen(true);
    setPrice(999);
    setstate("Buy");
  };

  const vote = movie.vote_average;
  const languagesList = movie.spoken_languages
    ?.map(({ english_name }) => english_name)
    .join(", ");
  const genres = movie.genres?.map(({ name }) => name).join(", ");

  return (
    <div>
      <PaymentModal
        className="z-10"
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        price={price}
        state={state}
      />
      <hr className="mt-1" />
      <div>
        <h2 className="py-1 text-center text-2xl font-bold text-gray-700 md:hidden">
          {movie.original_title}
        </h2>
      </div>
      <div
        className="flex justify-center lg:hidden md:hidden"
        style={{ width: "95%" }}
      >
        <img
          src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
          alt="Cover Poster"
          className="m-2 rounded-lg"
          style={{ width: "calc(100%-6rem)", height: "20rem" }}
        />
      </div>
      <div className="flex flex-col gap-3 lg:hidden">
        <div className="flex flex-col gap-2 pl-5 text-black">
          <div className="flex items-end gap-2 pt-2">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7">
                <FaStar className="h-full w-full text-red-500" />
              </span>
              <h4 className="text-xl font-semibold text-black">
                {vote !== undefined ? vote.toFixed(1) : "N/A"}/10
              </h4>
            </div>
            <h4>{movie.vote_count} votes</h4>
          </div>
          <div className="pt-2">
            <span className="rounded-sm pb-0.5 text-sm text-black">
              Languages : {languagesList}
            </span>
          </div>
          <h4 className="pb-3 text-sm text-black">
            {movie.runtime} min • {genres}
          </h4>
        </div>
        <div className="flex items-center gap-3 px-4 text-xl md:w-screen md:px-4">
          <button
            onClick={rentmovie}
            className="w-full rounded-lg bg-red-500 py-2 font-semibold text-white"
          >
            Rent INR 499
          </button>
          <button
            onClick={buymovie}
            className="w-full rounded-lg bg-red-500 py-2 font-semibold text-white"
          >
            Buy INR 999
          </button>
        </div>
      </div>

      <div
        className="relative hidden w-full lg:block"
        style={{ height: "29rem" }}
      >
        <div
          className="absolute z-20 h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(90deg,rgb(34,34,34,0.7),rgb(34,34,34,0.9) 3%,rgb(34,34,34) 6%, rgb(34,34,34) 24.95%, rgb(34,34,34) 30.2%, rgba(34,34,34,0.03) 97.47%, rgb(34, 34, 34) 100%)",
          }}
        >
          <div className="absolute left-16 top-9 z-30 flex gap-12">
            <div className="h-96 w-64">
              <img
                src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                alt="Movie Poster"
                className="h-full w-full rounded-lg"
              />
            </div>
            <div className="flex items-center">
              <MovieInfoComp movie={movie} />
            </div>
          </div>
        </div>
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt="BackDrop Poster"
          className="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  );
};

export default MovieHeroComp;
