import React, { useEffect, useState, useContext } from "react";
import DefaultLayout from "../Layouts/DefaultLayout";
import PlayFilersComp from "../Components/PlayFilters/PlayFilersComp";
import Poster from "../Components/PosterComp/Poster";
import { LoadingContext } from "../Context/LoagindContext";
import { PropagateLoader } from "react-spinners";
import api from "../lib/api";

const PlayPage = () => {
  const [PlayMovies, SetPlayMovies] = useState([]);
  const { loading, setloading } = useContext(LoadingContext);

  useEffect(() => {
    let ignore = false;

    async function loadPlays() {
      setloading(true);

      try {
        const response = await api.get("/content/plays", {
          params: { region: "IN" },
        });

        if (!ignore) {
          SetPlayMovies(response.data.plays || []);
        }
      } catch (err) {
        console.log(err.message);
      } finally {
        if (!ignore) {
          setloading(false);
        }
      }
    }

    loadPlays();

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
          <PropagateLoader className="pb-20 md:pb-28" color="#e33030" />
        </div>
      ) : (
        <>
          <div className="w-full flex mt-3 py-8 justify-between bg-gray-100 ">
            <div
              className="mx-10 hidden md:flex flex-col "
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
            <div className="mb-16 px-3">
              <div className="" style={{ width: "100%" }}>
                <h2 className="text-lg md:text-2xl font-bold text-gray-700">
                  Plays In Chennai
                </h2>
                <div className="flex justify-center flex-wrap gap-1 mt-5 ">
                  {PlayMovies.map((movie, index) => (
                    <div className="m-1 " key={movie.id || index}>
                      <Poster
                        {...movie}
                        isDark={false}
                        linking={true}
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

export default DefaultLayout(PlayPage);
