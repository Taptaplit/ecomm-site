import React, { Fragment, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { HomeContext } from "./index";
import { getAllCategory } from "../../admin/categories/FetchApi";
import { getAllProduct, productByPrice } from "../../admin/products/FetchApi";
import "./style.css";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { checkLanguage } from "../partials/Navber";

const apiURL = process.env.REACT_APP_API_URL;

function LeftArrow() {
  const { isFirstItemVisible, scrollPrev } =
    React.useContext(VisibilityContext);

  return (
    <div className="h-full flex justify-center items-center">
      <svg
        disabled={isFirstItemVisible}
        onClick={() => scrollPrev()}
        className="flex justify-center w-12 h-12 text-gray-700 opacity-25 cursor-pointer hover:text-yellow-700 hover:opacity-100"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </div>
  );
}

function RightArrow() {
  const { isLastItemVisible, scrollNext } = React.useContext(VisibilityContext);

  return (
    <div className="h-full flex justify-center items-center">
      <svg
        disabled={isLastItemVisible}
        onClick={() => scrollNext()}
        className="flex justify-center  w-12 h-12 text-gray-700 opacity-25 cursor-pointer hover:text-yellow-700 hover:opacity-100"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );
}

const CategoryList = () => {
  const history = useHistory();
  const { data } = useContext(HomeContext);
  const [categories, setCategories] = useState(null);
  const [language, setLanguage] = useState();

  useEffect(() => {
    const languages = checkLanguage();
    setLanguage(languages);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let responseData = await getAllCategory();
      if (responseData && responseData.Categories) {
        setCategories(responseData.Categories);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={`${data.categoryListDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <ScrollMenu
        LeftArrow={LeftArrow}
        RightArrow={RightArrow}
        className="py-1 flex overflow-x-hidden w-full justify-center items-center"
      >
        {categories && categories.length > 0 ? (
          categories.map((item, index) => {
            return (
              <Fragment key={index}>
                {item.cType === "Sub" && (
                  <div
                    onClick={(e) =>
                      history.push(`/products/category/${item._id}`)
                    }
                    className="col-span-1 m-2 flex flex-col items-center justify-center space-y-2 cursor-pointer"
                  >
                    <img
                      src={`${apiURL}/uploads/categories/${item.cImage}`}
                      className="h-31 w-31 object-cover"
                      alt="pic"
                    />
                    <div className="font-medium">
                      {language === "english" ? item.cName : item.aName}
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })
        ) : (
          <div className="text-xl text-center my-4">
            {language === "english" ? "No Category" : "لا تصنيف"}
          </div>
        )}
      </ScrollMenu>
    </div>
  );
};

const FilterList = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [range, setRange] = useState(0);

  const rangeHandle = (e) => {
    setRange(e.target.value);
    fetchData(e.target.value);
  };

  const fetchData = async (price) => {
    if (price === "all") {
      try {
        let responseData = await getAllProduct();
        if (responseData && responseData.Products) {
          dispatch({ type: "setProducts", payload: responseData.Products });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      dispatch({ type: "loading", payload: true });
      try {
        setTimeout(async () => {
          let responseData = await productByPrice(price);
          if (responseData && responseData.Products) {
            console.log(responseData.Products);
            dispatch({ type: "setProducts", payload: responseData.Products });
            dispatch({ type: "loading", payload: false });
          }
        }, 700);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const closeFilterBar = () => {
    fetchData("all");
    dispatch({ type: "filterListDropdown", payload: !data.filterListDropdown });
    setRange(0);
  };

  return (
    <div className={`${data.filterListDropdown ? "" : "hidden"} my-4`}>
      <hr />
      <div className="w-full flex flex-col">
        <div className="font-medium py-2">Filter by price</div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col space-y-2  w-2/3 lg:w-2/4">
            <label htmlFor="points" className="text-sm">
              Price (between 0 and 10$):{" "}
              <span className="font-semibold text-yellow-700">{range}.00$</span>{" "}
            </label>
            <input
              value={range}
              className="slider"
              type="range"
              id="points"
              min="0"
              max="1000"
              step="10"
              onChange={(e) => rangeHandle(e)}
            />
          </div>
          <div onClick={(e) => closeFilterBar()} className="cursor-pointer">
            <svg
              className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const Search = () => {
  const { data, dispatch } = useContext(HomeContext);
  const [search, setSearch] = useState("");
  const [productArray, setPa] = useState(null);

  const searchHandle = (e) => {
    setSearch(e.target.value);
    fetchData();
    dispatch({
      type: "searchHandleInReducer",
      payload: e.target.value,
      productArray: productArray,
    });
  };

  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });
    try {
      setTimeout(async () => {
        let responseData = await getAllProduct();
        if (responseData && responseData.Products) {
          setPa(responseData.Products);
          dispatch({ type: "loading", payload: false });
        }
      }, 700);
    } catch (error) {
      console.log(error);
    }
  };

  const closeSearchBar = () => {
    dispatch({ type: "searchDropdown", payload: !data.searchDropdown });
    fetchData();
    dispatch({ type: "setProducts", payload: productArray });
    setSearch("");
  };

  return (
    <div
      className={`${
        data.searchDropdown ? "" : "hidden"
      } my-4 flex items-center justify-between`}
    >
      <input
        value={search}
        onChange={(e) => searchHandle(e)}
        className="px-4 text-xl py-4 focus:outline-none"
        type="text"
        placeholder="Search products..."
      />
      <div onClick={(e) => closeSearchBar()} className="cursor-pointer">
        <svg
          className="w-8 h-8 text-gray-700 hover:bg-gray-200 rounded-full p-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
    </div>
  );
};

const ProductCategoryDropdown = (props) => {
  return (
    <Fragment>
      <CategoryList />
      <FilterList />
      <Search />
    </Fragment>
  );
};

export default ProductCategoryDropdown;
