import React, { Fragment, useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BiChevronDown, BiSearch } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { Listbox, Transition } from "@headlessui/react";
import { userContext } from "../../Context/UserContext";
import UserModal from "../UserModal/userModal";
import BookMyShowLogo from "../../assets/bookmyshow.svg";
import api from "../../lib/api";

const Locations = [
  { name: "Chennai" },
  { name: "Bangalore" },
  { name: "Hyderabed" },
  { name: "Noida" },
  { name: "Kerala" },
  { name: "Kochi" },
];

function Example() {
  const [selected, setSelected] = useState(Locations[0]);

  return (
    <div className="z-50 w-28">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white pl-3 text-left focus:outline-none sm:text-sm">
            <span className="block truncate text-base">{selected.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <BiChevronDown />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {Locations.map((location, locationIndex) => (
                <Listbox.Option
                  key={locationIndex}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 ${
                      active ? "bg-red-400" : "text-gray-900"
                    }`
                  }
                  value={location}
                >
                  {({ selected: isSelected }) => (
                    <span
                      className={`block truncate ${
                        isSelected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {location.name}
                    </span>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

function AuthButton({ signin, username, openModal, compact, isAuthLoading }) {
  if (isAuthLoading) {
    return (
      <button
        className={`rounded border border-gray-300 text-sm text-gray-500 ${
          compact ? "px-3 py-1.5" : "mt-1 px-3 py-1"
        }`}
        disabled
      >
        Checking...
      </button>
    );
  }

  if (signin) {
    return (
      <button
        className={`rounded bg-red-600 text-sm text-white ${
          compact ? "px-3 py-1.5" : "mt-1 px-3 py-1"
        }`}
        onClick={openModal}
      >
        Sign in
      </button>
    );
  }

  return (
    <button onClick={openModal}>
      <div className="flex items-center justify-center gap-1 pt-1 text-sm text-gray-700">
        <FaUserCircle className="h-5 w-5 text-gray-600" />
        <span className="max-w-28 truncate">Hi, {username}</span>
      </div>
    </button>
  );
}

function SearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    let ignore = false;
    const timer = setTimeout(async () => {
      setIsSearching(true);

      try {
        const response = await api.get("/content/search", {
          params: { q: query },
        });

        if (!ignore) {
          setResults(response.data.results || []);
        }
      } catch (error) {
        if (!ignore) {
          setResults([]);
        }
      } finally {
        if (!ignore) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [query]);

  const openMovie = (movieId) => {
    setQuery("");
    setResults([]);
    navigate(`/movie/${movieId}`);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="relative w-full">
      <div className="flex w-full items-center gap-3 rounded-md bg-white px-3 py-1">
        <BiSearch className="text-gray-500" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-transparent focus:outline-none"
          placeholder="Search for Movies, Events, Play, Sports and Activities"
        />
      </div>
      {(query.trim().length >= 2 || isSearching) && (
        <div className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
          {isSearching ? (
            <p className="px-4 py-3 text-sm text-gray-500">Searching...</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">No movies found.</p>
          ) : (
            results.map((result) => (
              <button
                key={result.id}
                type="button"
                className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left hover:bg-gray-50"
                onClick={() => openMovie(result.id)}
              >
                <div className="h-14 w-10 overflow-hidden rounded bg-gray-100">
                  {result.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200/${result.poster_path}`}
                      alt={result.title || result.original_title}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {result.title || result.original_title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {result.release_date || "Release date unavailable"}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function NavSm({ signin, username, openModal, isAuthLoading }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col justify-start">
          <h3 className="text-xl font-bold text-gray-700">It All Starts Here!</h3>
          <div className="z-50">
            <Example />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex h-8 items-center gap-3">
            <Link
              to="https://play.google.com/store/apps/details?id=com.bt.bms&hl=en_IN&gl=US&pli=1"
              target="_blank"
            >
              <button className="rounded-lg border border-gray-300 p-1.5 text-sm">
                Use App
              </button>
            </Link>
            <BiSearch className="h-5 w-5 text-gray-600" />
          </div>
          <AuthButton
            signin={signin}
            username={username}
            openModal={openModal}
            compact={true}
            isAuthLoading={isAuthLoading}
          />
        </div>
      </div>
    </div>
  );
}

function NavLg({
  playsActive,
  tvseriesActive,
  streamActive,
  signin,
  username,
  openModal,
  isAuthLoading,
}) {
  return (
    <div className="w-full">
      <div className="mx-auto flex w-full justify-between pt-1">
        <div className="mx-4 flex w-1/2 items-center gap-3">
          <div className="h-8 w-36">
            <Link to="/">
              <img src={BookMyShowLogo} alt="logo" className="h-full w-full" />
            </Link>
          </div>
          <SearchBox />
        </div>
        <div className="flex items-center gap-4">
          <div className="py-2">
            <Example />
          </div>
          <AuthButton
            signin={signin}
            username={username}
            openModal={openModal}
            isAuthLoading={isAuthLoading}
          />
        </div>
      </div>
      <div className="flex gap-3 px-6 pt-2">
        <Link
          to="/stream"
          className={`flex cursor-pointer items-center text-base text-gray-500 hover:text-red-500 ${
            streamActive ? "font-semibold text-red-500" : ""
          }`}
        >
          Streams
        </Link>
        <Link
          to="/plays"
          className={`flex cursor-pointer items-center text-base text-gray-500 hover:text-red-500 ${
            playsActive ? "font-semibold text-red-500" : ""
          }`}
        >
          Plays
        </Link>
        <Link
          to="/tvseries"
          className={`flex cursor-pointer items-center text-base text-gray-500 hover:text-red-500 ${
            tvseriesActive ? "font-semibold text-red-500" : ""
          }`}
        >
          Tv Series
        </Link>
      </div>
    </div>
  );
}

const NavbarComp = () => {
  const location = useLocation();
  const auth = useContext(userContext);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <UserModal isOpen={isOpen} setIsOpen={setIsOpen} />
      <nav>
        <div className="px-3 pt-2 md:hidden">
          <NavSm
            signin={auth.signin}
            username={auth.username}
            openModal={openModal}
            isAuthLoading={auth.isAuthLoading}
          />
        </div>
        <div className="hidden px-4 py-3 md:flex">
          <NavLg
            signin={auth.signin}
            username={auth.username}
            openModal={openModal}
            isAuthLoading={auth.isAuthLoading}
            streamActive={location.pathname === "/stream"}
            playsActive={location.pathname === "/plays"}
            tvseriesActive={location.pathname === "/tvseries"}
          />
        </div>
      </nav>
    </>
  );
};

export default NavbarComp;
