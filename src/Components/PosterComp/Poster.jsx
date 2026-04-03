import React from "react";
import { Link } from "react-router-dom";
import "../../App.css";

const Poster = (props) => {
  // const isDark = props.isDark ? props.isDark : false;

  function Containcomponet() {
    return (
      <>
        <div className="flex flex-col  items-start gap-2 px-1 md:px-3 w-40 sm:w-44 md:w-60">
          <div className="h-48 md:h-80">
            {props.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/original/${props.poster_path}`}
                alt="Poster"
                className="w-full h-full rounded-lg skeleton"
              ></img>
            ) : (
              <img
                src={`https://github.com/GowthamXeno/GowthamXeno/assets/101506428/9c1b5c2e-8067-4c27-8ad6-85720ce224cc`}
                alt="Poster"
                className="w-full h-full rounded-lg skeleton"
              />
            )}
          </div>
          <h3
            className={`text-sm font-bold md:text-lg ${
              props.isDark ? "text-white" : "text-gray-700"
            }`}
          >
            {props.title && props.title}
            {props.name && props.name}
          </h3>
        </div>
      </>
    );
  }
  const scrollToTop = () => {
    window.scrollTo({ top: 0 });
  };
  if (props.linking) {
    return (
      <>
        <Link to={`/movie/${props.id}`} onClick={scrollToTop}>
          <Containcomponet />
        </Link>
      </>
    );
  } else {
    return (
      <>
        <Containcomponet />
      </>
    );
  }
};

export default Poster;
