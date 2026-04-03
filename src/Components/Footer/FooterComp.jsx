import React from "react";
import {
  TiSocialFacebook,
  TiSocialInstagram,
  TiSocialPinterest,
  TiSocialYoutube,
  TiSocialLinkedin,
} from "react-icons/ti";
import { FaTwitter } from 'react-icons/fa6';
import { HiVideoCamera } from "react-icons/hi2";
import { PiTelevisionFill } from "react-icons/pi";
import { CiStreamOn } from "react-icons/ci";
import { Link, useLocation } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import "../../App.css";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function FooterSm({ homeActive, playActive, streamActive, tvseriesActive }) {
  return (
    <div className="px-9 py-1 overflow-hidden">
      <div className="flex justify-between items-center w-full">
        <div>
          <Link to="/" onClick={scrollToTop}>
            <div
              className={`flex flex-col items-center ${homeActive ? "text-red-600 font-semibold" : ""
                }`}
            >
              <img
                src="https://i.ibb.co/zPBYW3H/imgbin-bookmyshow-office-android-ticket-png.png"
                alt="Logo"
                className="w-5 h-5"
              />
              <h4 className={`text-xs`}>Home</h4>
            </div>
          </Link>
        </div>
        <div>
          <Link to="/stream">
            <div
              className={`flex flex-col items-center ${streamActive ? "text-red-600 font-semibold" : ""
                }`}
            >
              <CiStreamOn className="w-auto h-5" />
              <h4 className="text-sm">Streams</h4>
            </div>
          </Link>
        </div>
        <div>
          <Link to="/plays">
            <div
              className={`flex flex-col items-center ${playActive ? "text-red-600 font-semibold" : ""
                }`}
            >
              <HiVideoCamera className="w-auto h-5" />
              <h4 className="text-sm">Plays</h4>
            </div>
          </Link>
        </div>
        <div>
          <Link to="/tvseries">
            <div
              className={`flex flex-col items-center ${tvseriesActive ? "text-red-600 font-semibold" : ""
                }`}
            >
              <PiTelevisionFill className="w-auto h-5" />
              <h4 className="text-sm">Tv Series</h4>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FooterLg() {
  const ButtonStyle = {
    padding: "6px",
    border: "none",
    borderRadius: "50%",
    color: "#333338",
    objectFit: "cover",
  };
  const iconSize = {
    width: "25px",
    height: "25px",
    fontSize: "14px",
  };
  return (
    <>
      <div id="Footer" className="py-8" style={{ backgroundColor: "#333338" }}>
        <div className="flex justify-between px-8 items-center">
          <div className="flex items-center gap-2" style={{ color: "#ffffff" }}>
            <Link to="https://github.com/krishna4121" target="_blank">
              <div className="flex items-center gap-2">
                <FaGithub className="w-8 h-8" />

                <h2 className="text-lg font-semibold">krishna4121</h2>
              </div>
            </Link>
            <div className="ms-8">
              <p className="text-sm">
                Discover seamless movie booking with our Bookmyshow app ● Your
                entertainment companion.
              </p>
            </div>
          </div>
          <Link to="https://github.com/krishna4121/CineHub-MERN">
            <button className="bg-red-500 rounded-lg px-2 py-1 text-white">
              Source Code
            </button>
          </Link>
        </div>
        <div className="flex items-center justify-center py-4 pb-6 pt-10">
          <div
            className="flex-1 border-b"
            style={{ borderBottomColor: "#5d5d5f" }}
          ></div>
          <div className="mx-5">
            <img
              src="https://in.bmscdn.com/webin/common/icons/logo.svg"
              alt="BookMyShow Logo"
            ></img>
          </div>
          <div
            className="flex-1 border-b"
            style={{ borderBottomColor: "#5d5d5f" }}
          ></div>
        </div>
        <div className="flex items-center justify-center pb-5 pt-3 gap-3">

          <button
            className="bg-background-100 hover:bg-background-200"
            style={ButtonStyle}
          >
            <TiSocialFacebook style={iconSize} />{" "}
          </button>


          <button
            className="bg-background-100 hover:bg-background-200"
            style={ButtonStyle}
          >
            {" "}
            <FaTwitter style={iconSize} />{" "}
          </button>


          <button
            className="bg-background-100 hover:bg-background-200"
            style={ButtonStyle}
          >
            {" "}
            <TiSocialInstagram style={iconSize} />{" "}
          </button>


          <button
            className="bg-background-100 hover:bg-background-200"
            style={ButtonStyle}
          >
            {" "}
            <TiSocialYoutube style={iconSize} />{" "}
          </button>

          <button
            className="bg-background-100 hover:bg-background-200"
            style={ButtonStyle}
          >
            {" "}
            <TiSocialPinterest style={iconSize} />{" "}
          </button>


          {" "}
          <button
            className="bg-background-100 hover:bg-background-200"
            style={ButtonStyle}
          >
            {" "}
            <TiSocialLinkedin style={iconSize} />{" "}
          </button>

        </div>
        <div
          className="text-center px-10 py-4"
          style={{ color: "#666666", fontSize: "0.69rem" }}
        >
          <p>
            Copyright 2024 @ Bigtree Entertainment Pvt. Ltd. All Rights
            Reserved.
          </p>
          <p>
            The content and images used on this site are copyright protected and
            copyrights vests with the respective owners. The usage of the
            content and images on this website is intended to promote the works
            and no endorsement of the artist shall be implied. Unauthorized use
            is prohibited and punishable by law.
          </p>
        </div>
      </div>
    </>
  );
}
const FooterComp = () => {
  const location = useLocation();
  return (
    <>
      <div className="fixed left-0 bottom-0 w-full bg-white py-1 pt-1 border-t-1 border-gray-300 md:hidden">
        <FooterSm
          homeActive={location.pathname === "/"}
          playActive={location.pathname === "/plays"}
          tvseriesActive={location.pathname === "/tvseries"}
          streamActive={location.pathname === "/stream"}
        />
      </div>
      <div className="w-full hidden md:flex">
        <FooterLg />
      </div>
    </>
  );
};

export default FooterComp;
