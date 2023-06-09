import React, { Fragment, useContext, useState } from "react";
import { CategoryContext } from "./index";
import { createCategory, getAllCategory } from "./FetchApi";

const AddCategoryModal = (props) => {
  const { data, dispatch } = useContext(CategoryContext);

  const alert = (msg, type) => (
    <div className={`bg-${type}-200 py-2 px-4 w-full`}>{msg}</div>
  );
  const [fData, setFdata] = useState({
    cName: "",
    aName: "",
    cDescription: "",
    aDescription: "",
    cImage: "",
    cStatus: "Active",
    cType: "Sub",
    cSubCategory: [],
    aSubCategory: [],
    success: false,
    error: false,
  });
  console.log(fData);

  const fetchData = async () => {
    let responseData = await getAllCategory();
    if (responseData.Categories) {
      dispatch({
        type: "fetchCategoryAndChangeState",
        payload: responseData.Categories,
      });
    }
  };

  if (fData.error || fData.success) {
    setTimeout(() => {
      setFdata({ ...fData, success: false, error: false });
    }, 2000);
  }

  const submitForm = async (e) => {
    dispatch({ type: "loading", payload: true });
    // Reset and prevent the form
    e.preventDefault();
    e.target.reset();

    if (!fData.cImage) {
      dispatch({ type: "loading", payload: false });
      return setFdata({ ...fData, error: "Please upload a category image" });
    }

    try {
      let responseData = await createCategory(fData);
      if (responseData.success) {
        fetchData();
        setFdata({
          ...fData,
          cName: "",
          aName: "",
          cDescription: "",
          aDescription: "",
          cImage: "",
          cSubCategory: [],
          aSubCategory: [],
          cStatus: "Active",
          cType: "Sub",
          success: responseData.success,
          error: false,
        });
        dispatch({ type: "loading", payload: false });
        setTimeout(() => {
          setFdata({
            ...fData,
            cName: "",
            aName: "",
            cDescription: "",
            aDescription: "",
            cSubCategory: [],
            aSubCategory: [],
            cStatus: "Active",
            cType: "Sub",
            success: false,
            error: false,
          });
        }, 2000);
      } else if (responseData.error) {
        setFdata({ ...fData, success: false, error: responseData.error });
        dispatch({ type: "loading", payload: false });
        setTimeout(() => {
          return setFdata({ ...fData, error: false, success: false });
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      {/* Black Overlay */}
      <div
        onClick={(e) => dispatch({ type: "addCategoryModal", payload: false })}
        className={`${
          data.addCategoryModal ? "" : "hidden"
        } fixed top-0 left-0 z-30 w-full h-full bg-black opacity-50`}
      />
      {/* End Black Overlay */}

      {/* Modal Start */}
      <div
        className={`${
          data.addCategoryModal ? "" : "hidden"
        } fixed inset-0 m-4  flex items-center z-30 justify-center my-6`}
      >
        <div className="relative bg-white w-12/12 md:w-3/6 shadow-lg flex flex-col items-center space-y-4  overflow-y-auto px-4 py-4 md:px-8 h-screen overflow-y-auto">
          <div className="flex items-center justify-between w-full pt-4">
            <span className="text-left font-semibold text-2xl tracking-wider">
              Add Category
            </span>
            {/* Close Modal */}
            <span
              style={{ background: "#303031" }}
              onClick={(e) =>
                dispatch({ type: "addCategoryModal", payload: false })
              }
              className="cursor-pointer text-gray-100 py-2 px-2 rounded-full"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </span>
          </div>
          {fData.error ? alert(fData.error, "red") : ""}
          {fData.success ? alert(fData.success, "green") : ""}
          <form className="w-full" onSubmit={(e) => submitForm(e)}>
            <div className="flex flex-col space-y-1 w-full">
              <label htmlFor="status">Category Type</label>
              <select
                name="status"
                onChange={(e) =>
                  setFdata({
                    ...fData,
                    success: false,
                    error: false,
                    cType: e.target.value,
                  })
                }
                className="px-4 py-2 border focus:outline-none"
                id="status"
              >
                <option name="status" value="Sub">
                  Sub-Category
                </option>
                <option name="status" value="Normal">
                  Category
                </option>
              </select>
            </div>
            <div className="flex flex-col space-y-1 w-full py-4">
              <label htmlFor="name">Category Name</label>
              <input
                onChange={(e) =>
                  setFdata({
                    ...fData,
                    success: false,
                    error: false,
                    cName: e.target.value,
                  })
                }
                value={fData.cName}
                className="px-4 py-2 border focus:outline-none"
                type="text"
              />
            </div>
            <div className="flex flex-col space-y-1 w-full py-4">
              <label htmlFor="name">Category Name (Arabic)</label>
              <input
                onChange={(e) =>
                  setFdata({
                    ...fData,
                    success: false,
                    error: false,
                    aName: e.target.value,
                  })
                }
                value={fData.aName}
                className="px-4 py-2 border focus:outline-none"
                type="text"
              />
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <label htmlFor="description">Category Description</label>
              <textarea
                onChange={(e) =>
                  setFdata({
                    ...fData,
                    success: false,
                    error: false,
                    cDescription: e.target.value,
                  })
                }
                value={fData.cDescription}
                className="px-4 py-2 border focus:outline-none"
                name="description"
                id="description"
                cols={5}
                rows={5}
              />
            </div>
            <div className="flex flex-col space-y-1 w-full my-2">
              <label htmlFor="description">Category Description (Arabic)</label>
              <textarea
                onChange={(e) =>
                  setFdata({
                    ...fData,
                    success: false,
                    error: false,
                    aDescription: e.target.value,
                  })
                }
                value={fData.aDescription}
                className="px-4 py-2 border focus:outline-none"
                name="description"
                id="description"
                cols={5}
                rows={5}
              />
            </div>
            {/* Image Field & function */}
            <div className="flex flex-col space-y-1 w-full">
              <label htmlFor="name">Category Image</label>
              <input
                accept=".jpg, .jpeg, .png"
                onChange={(e) => {
                  setFdata({
                    ...fData,
                    success: false,
                    error: false,
                    cImage: e.target.files[0],
                  });
                }}
                className="px-4 py-2 border focus:outline-none"
                type="file"
              />
            </div>
            <div className="flex flex-col space-y-1 w-full">
              <label htmlFor="status">Category Status</label>
              <select
                name="status"
                onChange={(e) =>
                  setFdata({
                    ...fData,
                    success: false,
                    error: false,
                    cStatus: e.target.value,
                  })
                }
                className="px-4 py-2 border focus:outline-none"
                id="status"
              >
                <option name="status" value="Active">
                  Active
                </option>
                <option name="status" value="Disabled">
                  Disabled
                </option>
              </select>
            </div>
            <div className="flex flex-col space-y-1 w-full mt-4">
              <label htmlFor="name">
                Sub-Categories (Seperate with semi-colon)
              </label>
              <input
                onChange={(e) => {
                  if (e.target.value.endsWith(";")) {
                    const subs = fData.cSubCategory;
                    subs.push(
                      e.target.value.split(";")[
                        e.target.value.split(";").length - 2
                      ]
                    );
                    setFdata({
                      ...fData,
                      success: false,
                      error: false,
                      cSubCategory: subs,
                    });
                  }
                }}
                className="px-4 py-2 border focus:outline-none"
                type="text"
              />
            </div>
            <div className="flex flex-col space-y-1 w-full mt-4">
              <label htmlFor="name">
                Sub-Categories (Arabic, seperate with semi-colon)
              </label>
              <input
                onChange={(e) => {
                  if (e.target.value.endsWith(";")) {
                    const subs = fData.aSubCategory;
                    subs.push(
                      e.target.value.split(";")[
                        e.target.value.split(";").length - 2
                      ]
                    );
                    setFdata({
                      ...fData,
                      success: false,
                      error: false,
                      aSubCategory: subs,
                    });
                  }
                }}
                className="px-4 py-2 border focus:outline-none"
                type="text"
              />
            </div>
            <div className="flex flex-col space-y-1 w-full pb-4 md:pb-6 mt-4">
              <button
                style={{ background: "#303031" }}
                type="submit"
                className="bg-gray-800 text-gray-100 rounded-full text-lg font-medium py-2"
              >
                Create category
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default AddCategoryModal;
