import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./style.css";

import { logout } from "./Action";
import { LayoutContext } from "../index";
import { isAdmin } from "../auth/fetchApi";
import axios from "axios";
import { getAllCategory } from "../../admin/categories/FetchApi";

export const checkLanguage = () => {
  const language = localStorage.getItem("balquees_language");
  return language;
};

const Navber = (props) => {
  const history = useHistory();
  const location = useLocation();
  const apiURL = process.env.REACT_APP_API_URL;

  const { data, dispatch } = useContext(LayoutContext);
  const [language, setLanguage] = useState();
  const [dropdown, setDropdown] = useState(false);
  const [categories, setCategories] = useState();
  const [subCategory, setSubCategory] = useState("makeup");
  useEffect(() => {
    const current_lang = checkLanguage();
    setLanguage(current_lang);
    getAllCategory().then((res) => setCategories(res));
  }, []);

  const navberToggleOpen = () =>
    data.navberHamburger
      ? dispatch({ type: "hamburgerToggle", payload: false })
      : dispatch({ type: "hamburgerToggle", payload: true });

  const loginModalOpen = () =>
    data.loginSignupModal
      ? dispatch({ type: "loginSignupModalToggle", payload: false })
      : dispatch({ type: "loginSignupModalToggle", payload: true });

  const cartModalOpen = () =>
    data.cartModal
      ? dispatch({ type: "cartModalToggle", payload: false })
      : dispatch({ type: "cartModalToggle", payload: true });

  const translatePage = () => {
    const current_lang = checkLanguage();
    if (current_lang === null) {
      localStorage.setItem("balquees_language", "arabic");
    } else if (current_lang === "arabic") {
      localStorage.setItem("balquees_language", "english");
    } else if (current_lang === "english") {
      localStorage.setItem("balquees_language", "arabic");
    }
    window.location.reload();
  };

  console.log(categories);

  return (
    <Fragment>
      {/* Navber Section */}
      {dropdown && (
        <div className="fixed z-40 left-0 top-0 w-screen h-screen bg-red-200 flex flex-col justify-start items-start">
          <p className=" mt-4 ml-6 font-bold text-9xl">
            <span
              className="hover:cursor-pointer"
              onClick={() => setDropdown(false)}
            >
              {"<"}
            </span>{" "}
            <span className="ml-4 font-medium text-4xl tracking-widest">
              Categories
            </span>
          </p>
          <div className="w-screen h-full flex">
            <div className="w-1/4 h-full py-16 px-8">
              {categories &&
                categories.Categories.map((category) => (
                  <div
                    onClick={() => setSubCategory(category.cName.toLowerCase())}
                    className="w-full flex justify-between items-center text-gray-700 hover:cursor-pointer hover:text-black"
                  >
                    <p className="text-3xl font-medium">
                      {language === "english" ? category.cName : category.aName}
                    </p>
                    <p className="text-4xl font-medium">{">"}</p>
                  </div>
                ))}
            </div>
            {/* {categories && categories.Categories.map((category) => <>{console.log(JSON.parse(category[language === "english" ? "cSubCategory" : "aSubCategory"]))}</>)} */}
            {categories &&
              categories.Categories.map((category) => (
                <>
                  {subCategory === category.cName.toLowerCase() && (
                    <div className="w-3/4 h-full pt-16 bg-red-200 flex items-start justify-start ml-6">
                      {Object.entries(
                        JSON.parse(
                          category[
                            language === "english"
                              ? "cSubCategory"
                              : "aSubCategory"
                          ]
                        )
                      ).map((subCategories) => (
                        <div className="w-1/4 flex flex-col items-start justify-start px-2">
                          <h1 className="text-2xl font-medium">
                            {subCategories[0]}
                          </h1>
                          <ul className="mt-3">
                            {subCategories[1].map((subCategory) => (
                              <li className="text-sm font-medium">
                                {subCategory}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="w-1/4 flex flex-col items-start justify-start px-2">
                        <h1 className="text-xs font-medium text-gray-700">
                          Featured
                        </h1>
                        <ul className="mt-2">
                          {language === "english" &&
                            category.cFeatured.map((name) => (
                              <li className="text-sm font-medium">{name}</li>
                            ))}
                          {language !== "english" &&
                            category.aFeatured.map((name) => (
                              <li className="text-sm font-medium">{name}</li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </>
              ))}
            {/* {subCategory === "makeup" && (
              <div className="w-3/4 h-full pt-16 bg-red-200 flex items-start justify-end">
                <div className="w-1/4 flex flex-col items-start justify-start px-2">
                  <h1 className="text-2xl font-medium">Face</h1>
                  <ul className="mt-3">
                    <li className="text-sm font-medium">Foundation</li>
                    <li className="text-sm font-medium">Foundation</li>
                    <li className="text-sm font-medium">Face Powder</li>
                    <li className="text-sm font-medium">Concealer</li>
                    <li className="text-sm font-medium">Color Correcting</li>
                    <li className="text-sm font-medium">Face Primer</li>
                    <li className="text-sm font-medium">BB & CC Creams</li>
                    <li className="text-sm font-medium">Blush</li>
                    <li className="text-sm font-medium">Bronzer</li>
                    <li className="text-sm font-medium">Contouring</li>
                    <li className="text-sm font-medium">Highlighter</li>
                    <li className="text-sm font-medium">
                      Setting Spray & Powder
                    </li>
                    <li className="text-sm font-medium">Makeup Remover</li>
                  </ul>
                  <h1 className="mt-10 text-2xl font-medium">Lips</h1>
                  <ul className="mt-3">
                    <li className="text-sm font-medium">Lipstick</li>
                    <li className="text-sm font-medium">Lip Gloss</li>
                    <li className="text-sm font-medium">Lip Liner</li>
                    <li className="text-sm font-medium">Lip Stain</li>
                    <li className="text-sm font-medium">Lip Plumpers</li>
                    <li className="text-sm font-medium">Lip Tints & Balms</li>
                    <li className="text-sm font-medium">Lip Primer</li>
                  </ul>
                </div>
                <div className="w-1/4 flex flex-col items-start justify-start px-2">
                  <h1 className="text-2xl font-medium">Face</h1>
                  <ul className="mt-3">
                    <li className="text-sm font-medium">Foundation</li>
                    <li className="text-sm font-medium">Foundation</li>
                    <li className="text-sm font-medium">Face Powder</li>
                    <li className="text-sm font-medium">Concealer</li>
                    <li className="text-sm font-medium">Color Correcting</li>
                    <li className="text-sm font-medium">Face Primer</li>
                    <li className="text-sm font-medium">BB & CC Creams</li>
                    <li className="text-sm font-medium">Blush</li>
                    <li className="text-sm font-medium">Bronzer</li>
                    <li className="text-sm font-medium">Contouring</li>
                    <li className="text-sm font-medium">Highlighter</li>
                    <li className="text-sm font-medium">
                      Setting Spray & Powder
                    </li>
                    <li className="text-sm font-medium">Makeup Remover</li>
                  </ul>
                  <h1 className="mt-10 text-2xl font-medium">Lips</h1>
                  <ul className="mt-3">
                    <li className="text-sm font-medium">Lipstick</li>
                    <li className="text-sm font-medium">Lip Gloss</li>
                    <li className="text-sm font-medium">Lip Liner</li>
                    <li className="text-sm font-medium">Lip Stain</li>
                    <li className="text-sm font-medium">Lip Plumpers</li>
                    <li className="text-sm font-medium">Lip Tints & Balms</li>
                    <li className="text-sm font-medium">Lip Primer</li>
                  </ul>
                </div>
                <div className="w-1/4 flex flex-col items-start justify-start px-2">
                  <h1 className="text-2xl font-medium">Face</h1>
                  <ul className="mt-3">
                    <li className="text-sm font-medium">Foundation</li>
                    <li className="text-sm font-medium">Foundation</li>
                    <li className="text-sm font-medium">Face Powder</li>
                    <li className="text-sm font-medium">Concealer</li>
                    <li className="text-sm font-medium">Color Correcting</li>
                    <li className="text-sm font-medium">Face Primer</li>
                    <li className="text-sm font-medium">BB & CC Creams</li>
                    <li className="text-sm font-medium">Blush</li>
                    <li className="text-sm font-medium">Bronzer</li>
                    <li className="text-sm font-medium">Contouring</li>
                    <li className="text-sm font-medium">Highlighter</li>
                    <li className="text-sm font-medium">
                      Setting Spray & Powder
                    </li>
                    <li className="text-sm font-medium">Makeup Remover</li>
                  </ul>
                  <h1 className="mt-10 text-2xl font-medium">Lips</h1>
                  <ul className="mt-3">
                    <li className="text-sm font-medium">Lipstick</li>
                    <li className="text-sm font-medium">Lip Gloss</li>
                    <li className="text-sm font-medium">Lip Liner</li>
                    <li className="text-sm font-medium">Lip Stain</li>
                    <li className="text-sm font-medium">Lip Plumpers</li>
                    <li className="text-sm font-medium">Lip Tints & Balms</li>
                    <li className="text-sm font-medium">Lip Primer</li>
                  </ul>
                </div>
                <div className="w-1/4 flex flex-col items-start justify-start px-2">
                  <h1 className="text-xs font-medium text-gray-700">
                    Featured
                  </h1>
                  <ul className="mt-2">
                    <li className="text-sm font-medium">Foundation</li>
                    <li className="text-sm font-medium">Foundation</li>
                    <li className="text-sm font-medium">Face Powder</li>
                    <li className="text-sm font-medium">Concealer</li>
                    <li className="text-sm font-medium">Color Correcting</li>
                    <li className="text-sm font-medium">Face Primer</li>
                    <li className="text-sm font-medium">BB & CC Creams</li>
                    <li className="text-sm font-medium">Blush</li>
                    <li className="text-sm font-medium">Bronzer</li>
                    <li className="text-sm font-medium">Contouring</li>
                    <li className="text-sm font-medium">Highlighter</li>
                    <li className="text-sm font-medium">
                      Setting Spray & Powder
                    </li>
                    <li className="text-sm font-medium">Makeup Remover</li>
                  </ul>
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}
      <nav className="absolute top-0 w-full z-20 shadow-lg lg:shadow-none bg-accent">
        <div className="m-4 md:mx-12 md:my-6 grid grid-cols-4 lg:grid-cols-3">
          <div className="hidden lg:block col-span-1 flex text-gray-600 mt-1">
            <span
              className="hover:bg-gray-200 px-4 py-3 rounded-lg font-light tracking-widest hover:text-gray-800 cursor-pointer"
              onClick={(e) => setDropdown(true)}
            >
              {language === "english" ? "Shop" : "محل"}
            </span>
            {/* <span
              className="hover:bg-gray-200 px-4 py-3 rounded-lg font-light tracking-widest hover:text-gray-800 cursor-pointer"
              onClick={(e) => history.push("/blog")}
            >
              {language === "english" ? "Blog" : "مدونة"}
            </span>
            <span
              className="hover:bg-gray-200 px-4 py-3 rounded-lg font-light tracking-widest hover:text-gray-800 cursor-pointer"
              onClick={(e) => history.push("/contact-us")}
            >
              {language === "english" ? "Contact Us" : "اتصل بنا"}
            </span> */}
          </div>

          <div className="col-span-2 lg:hidden flex justify-items-stretch	 items-center">
            <svg
              onClick={(e) => navberToggleOpen()}
              className="col-span-1 lg:hidden w-8 h-8 cursor-pointer text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span
              onClick={(e) => history.push("/")}
              style={{ letterSpacing: "0.10rem" }}
              className="flex items-left ml-2 text-center font-bold uppercase text-gray-800 text-2xl cursor-pointer px-2 text-center"
            >
              <div className="w-full flex justify-center items-center">
                <img
                  src="https://fontmeme.com/permalink/230512/cbe3d7ee2a9b2df287db14112438018d.png"
                  alt="arabic"
                  border="0"
                  className="h-10"
                />
              </div>
            </span>
          </div>
          <div
            onClick={(e) => history.push("/")}
            className="hidden lg:block flex items-center  justify-center col-span-1 text-gray-800 font-bold cursor-pointer"
          >
            <div className="w-full flex justify-center items-center">
              <img
                src="https://fontmeme.com/permalink/230512/cbe3d7ee2a9b2df287db14112438018d.png"
                alt="arabic"
                border="0"
                className="h-12"
              />
            </div>
          </div>
          <div className="flex items-right col-span-2 lg:col-span-1 flex justify-end">
            {/*  WishList Page Button */}
            <div
              onClick={(e) => history.push("/wish-list")}
              className="hover:bg-gray-200 rounded-lg px-2 py-2 cursor-pointer"
              title="Wishlist"
            >
              <svg
                className={`${
                  location.pathname === "/wish-list"
                    ? "fill-current text-gray-800"
                    : ""
                } w-8 h-8 text-gray-600 cursor-pointer`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            {localStorage.getItem("jwt") ? (
              <Fragment>
                <div
                  className="userDropdownBtn hover:bg-gray-200 px-2 py-2 rounded-lg relative"
                  title="Logout"
                >
                  <svg
                    className="cursor-pointer w-8 h-8 text-gray-600 hover:text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="userDropdown absolute right-0 mt-1 bg-gray-200 rounded">
                    {!isAdmin() ? (
                      <Fragment>
                        <li className="flex flex-col text-gray-700 w-48 shadow-lg">
                          <span
                            onClick={(e) => history.push("/user/orders")}
                            className="flex space-x-2 py-2 px-8 hover:bg-gray-400 cursor-pointer"
                          >
                            <span>
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </span>
                            <span>My Orders</span>
                          </span>
                          <span
                            onClick={(e) => history.push("/user/profile")}
                            className="flex space-x-2 py-2 px-8 hover:bg-gray-400 cursor-pointer"
                          >
                            <span>
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </span>
                            <span>My Account</span>
                          </span>
                          <span
                            onClick={(e) => history.push("/wish-list")}
                            className="flex space-x-2 py-2 px-8 hover:bg-gray-400 cursor-pointer"
                          >
                            <span>
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                              </svg>
                            </span>
                            <span>My Wishlist</span>
                          </span>
                          <span
                            onClick={(e) => history.push("/user/setting")}
                            className="flex space-x-1 py-2 px-8 hover:bg-gray-400 cursor-pointer"
                          >
                            <span>
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </span>
                            <span>Setting</span>
                          </span>
                          <span
                            onClick={(e) => logout()}
                            className="flex space-x-2 py-2 px-8 hover:bg-gray-400 cursor-pointer"
                          >
                            <span>
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                            </span>
                            <span>Logout</span>
                          </span>
                        </li>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <li className="flex flex-col text-gray-700 w-48 shadow-lg">
                          <span
                            onClick={(e) => history.push("/admin/dashboard")}
                            className="flex space-x-2 py-2 px-8 hover:bg-gray-400 cursor-pointer"
                          >
                            <span>
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </span>
                            <span>Admin Panel</span>
                          </span>
                          <span
                            onClick={(e) => logout()}
                            className="flex space-x-2 py-2 px-8 hover:bg-gray-400 cursor-pointer"
                          >
                            <span>
                              <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                            </span>
                            <span>Logout</span>
                          </span>
                        </li>
                      </Fragment>
                    )}
                  </div>
                </div>
              </Fragment>
            ) : (
              /* Login Modal Button */
              <div
                onClick={(e) => loginModalOpen()}
                className="cursor-pointer hover:bg-gray-200 px-2 py-2 rounded-lg"
                title="Login"
              >
                <svg
                  className="w-8 h-8 text-gray-600 hover:text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
            )}
            {/* Cart Modal Button */}
            <div
              onClick={(e) => cartModalOpen()}
              className="hover:bg-gray-200 px-2 py-2 rounded-lg relative cursor-pointer"
              title="Cart"
            >
              <svg
                className="w-8 h-8 text-gray-600 hover:text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span className="absolute top-0 ml-6 mt-1 bg-yellow-700 rounded px-1 text-white text-xs hover:text-gray-200 font-semibold">
                {data.cartProduct !== null ? data.cartProduct.length : 0}
              </span>
            </div>
            {/* Translation Button */}
            <div
              onClick={(e) => translatePage()}
              className="hover:bg-gray-200 px-2 py-2 rounded-lg relative cursor-pointer scale-50"
              title="Translate"
            >
              <img src="/translate.svg" className="scale-50" />
            </div>
          </div>
        </div>
        <div
          className={
            data.navberHamburger && data.navberHamburger
              ? "px-1 pb-2 md:pb-0 md:px-10 lg:hidden"
              : "hidden px-1 pb-2 md:pb-0 md:px-10 lg:hidden"
          }
        >
          <div className="col-span-1 flex flex-col text-gray-600">
            <span
              className="font-medium text-lg tracking-widest hover:text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer"
              onClick={(e) => history.push("/")}
            >
              Shop
            </span>
            <span
              className="font-medium text-lg tracking-widest hover:text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer"
              onClick={(e) => history.push("/blog")}
            >
              Blog
            </span>
            <span
              className="font-medium text-lg tracking-widest hover:text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer"
              onClick={(e) => history.push("/contact-us")}
            >
              Contact us
            </span>
          </div>
        </div>
      </nav>
      {/* End Navber Section */}
    </Fragment>
  );
};

export default Navber;