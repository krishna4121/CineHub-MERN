import React, { useEffect, useState, useContext } from "react";
import DefaultLayout from "../Layouts/DefaultLayout";
import PlayFilersComp from "../Components/PlayFilters/PlayFilersComp";
import Poster from "../Components/PosterComp/Poster";
import { LoadingContext } from "../Context/LoagindContext";
import { PropagateLoader } from "react-spinners";
import api from "../lib/api";

const TvSeries = () => {
  const [PlayMovies, SetPlayMovies] = useState([]);
  const { loading, setloading } = useContext(LoadingContext);

  useEffect(() => {
    let ignore = false;

    async function loadShows() {
      setloading(true);

      try {
        const response = await api.get("/content/tv/popular", {
          params: { region: "IN" },
        });

        if (!ignore) {
          SetPlayMovies(response.data.shows || []);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        if (!ignore) {
          setloading(false);
        }
      }
    }

    loadShows();

    return () => {
      ignore = true;
    };
  }, [setloading]);

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
          <div className="w-full flex mt-3 py-8 justify-between bg-gray-100 ">
            <div
              className="mx-10 flex-col hidden md:flex"
              style={{ width: "90rem" }}
            >
              <div className="w-full h-full">
                <h2 className="text-2xl font-bold mb-4  text-gray-800">
                  Filters
                </h2>
                <div className="w-full">
                  <div className="bg-white">
                    <PlayFilersComp
                      title="Date"
                      tags={["Today", "Tomorrow", "This Weekend"]}
                    />
                  </div>
                  <div className="bg-white">
                    <PlayFilersComp
                      title="Language"
                      tags={["Tamil", "English", "Kannada", "Hindi", "Telgu"]}
                    />
                  </div>
                  <div className="bg-white">
                    <PlayFilersComp
                      title="Genres"
                      tags={[
                        "Drama",
                        "Comedy",
                        "Adult",
                        "Adventure",
                        "Fantasy",
                        "Historical",
                        "Musical",
                        "Suspense",
                        "Thriller",
                        "Sci-Fi",
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-16">
              <div className="" style={{ width: "100%" }}>
                <h2 className="text-2xl font-bold text-gray-700">
                  Popular Tv Shows
                </h2>
                <div className="flex justify-center flex-wrap gap-5 mt-5 ">
                  {PlayMovies.map((movie, index) => (
                    <div className="m-3 h-auto w-auto " key={movie.id || index}>
                      <Poster
                        {...movie}
                        isDark={false}
                        linking={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DefaultLayout(TvSeries);
