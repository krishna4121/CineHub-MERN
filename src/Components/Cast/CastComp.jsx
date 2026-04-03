import React from "react";

const Cast = (props) => {
  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 md:w-32 md:h-32">
          {props.image ? (
            <img
              src={`https://image.tmdb.org/t/p/original${props.image}`}
              alt="Cast and Crew Members"
              className="w-full h-full rounded-full object-center object-cover"
            />
          ) : (
            <img
              src={`https://github.com/GowthamXeno/GowthamXeno/assets/101506428/d1527d3a-81c5-48d2-b67c-a8b55cd2f2f7`}
              alt="Cast and Crew Members"
              className="w-full h-full rounded-full object-center object-cover"
            />
          )}
        </div>
        <h1 className="text-2xs md:text-xl text-gray-800">{props.castName}</h1>
        <h5 className="text-3xs md:text-sm text-gray-500">as {props.role}</h5>
      </div>
    </div>
  );
};

export default Cast;
