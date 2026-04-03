import React, { useContext, useState } from "react";
import { MovieContext } from "../../Context/MovieContext";
import { FaStar } from "react-icons/fa6";
import PaymentModal from "../PaymentModal/PaymentComp";

const MovieInfoComp = () => {
  const { movie } = useContext(MovieContext);
  const genres = movie.genres?.map(({ name }) => name).join(", ");
  const vote = movie.vote_average;
  const languagesList = movie.spoken_languages
    ?.map(({ english_name }) => english_name)
    .join(" • ");
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [state, setstate] = useState("");

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

  return (
    <>
      <PaymentModal
        className="z-10"
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        price={price}
        state={state}
      />
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold text-white">{movie.original_title}</h1>
        <div className="flex flex-col gap-3 text-white">
          <div className="flex items-end gap-2 pt-7">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7">
                <FaStar className="h-full w-full text-red-500" />
              </span>
              <h4 className="text-2xl font-semibold">
                {vote !== undefined ? vote.toFixed(1) : "N/A"}/10
              </h4>
            </div>
            <h4>{movie.vote_count} votes</h4>
          </div>
          <div className="pt-3">
            <span className="rounded-sm pb-0.5">Languages : {languagesList}</span>
          </div>
          <h4 className="pb-7 font-medium">
            {movie.runtime} min • {genres}
          </h4>
        </div>
        <div className="flex w-96 items-start gap-3 py-4 text-xl">
          <button
            onClick={rentmovie}
            className="w-full rounded-lg bg-red-500 py-3 font-semibold text-white"
          >
            Rent INR 499
          </button>
          <button
            onClick={buymovie}
            className="w-full rounded-lg bg-red-500 py-3 font-semibold text-white"
          >
            Buy INR 999
          </button>
        </div>
      </div>
    </>
  );
};

export default MovieInfoComp;
