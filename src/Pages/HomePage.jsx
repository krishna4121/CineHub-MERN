import { useEffect, useState, useContext } from "react";
import DefaultLayout from "../Layouts/DefaultLayout";
import PosterSlider from "../Components/PosterComp/PosterSlider";
import HeroCarousel from "../Components/HeroCarousel/HeroCarouselComp";
import EndlessEntertainment from "../Components/Entertainment/EndlessEntertainment";
import EntertainmentCardSlider from "../Components/Entertainment/EntertainmentCardSlider";
import { LoadingContext } from "../Context/LoagindContext";
import { PropagateLoader } from "react-spinners";
import api from "../lib/api";

const HomePage = () => {
  const [recommendedMovies, SetrecommendedMovies] = useState([]);
  const [PremierMovies, SetPremierMovies] = useState([]);
  const [onlineStreamEvents, SetonlineStreamEvents] = useState([]);
  const { loading, setloading } = useContext(LoadingContext);

  useEffect(() => {
    let ignore = false;

    async function loadHomeContent() {
      setloading(true);

      try {
        const response = await api.get("/content/home");

        if (ignore) {
          return;
        }

        SetrecommendedMovies(response.data.topRated || []);
        SetPremierMovies(response.data.popular || []);
        SetonlineStreamEvents(response.data.upcoming || []);
      } catch (err) {
        console.log(err.message);
      } finally {
        if (!ignore) {
          setloading(false);
        }
      }
    }

    loadHomeContent();

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
          <div className="w-full h-full overflow-hidden">
            <HeroCarousel />

            <div className="mx-auto px-4 md:px-12 my-8">
              <PosterSlider
                posters={recommendedMovies}
                isDark={false}
                title="Recommended Movies"
                subtitle="List of recommonded movies"
              />
            </div>

            <EndlessEntertainment />

            <EntertainmentCardSlider />

            <div>
              <div className="mx-auto px-4 md:px-12 my-8 bg-premier-800">
                <div>
                  <img
                    src="https://in.bmscdn.com/discovery-catalog/collections/tr:w-1440,h-120/premiere-rupay-banner-web-collection-202104230555.png"
                    alt="Rupay"
                    className="w-full h-full"
                  />
                </div>
                <PosterSlider
                  title="Premiers"
                  subtitle="Brand new releases every Friday"
                  posters={PremierMovies}
                  isDark={true}
                />
              </div>
            </div>

            <div className="mx-auto px-4 md:px-12 my-8 mb-16">
              <PosterSlider
                title="Online Streaming Events"
                subtitle="Online Stream Events"
                posters={onlineStreamEvents}
                isDark={false}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DefaultLayout(HomePage);
