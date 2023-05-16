import React, { Fragment, useContext, useEffect } from "react";
import { UserContext } from "./index";
import { fetchData } from "./Actions";

function AllUsers() {
  const { data, dispatch } = useContext(UserContext);
  const { users, loading } = data;

  useEffect(() => {
    fetchData(dispatch);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-white">
        <svg
          className="w-12 h-12 animate-spin text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </div>
    );
  }
  return (
    <Fragment>
      <div className="col-span-1 overflow-auto bg-white shadow-lg p-4">
        <table className="table-auto border w-full my-2">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Created at</th>
              <th className="px-4 py-2 border">Updated at</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((item, i) => {
                return (
                  <Fragment>
                    <tr className="border-b-2 border-b-gray-200">
                      <td className="py-2 px-2">
                        {item.name}
                      </td>
                      <td className="py-2 px-2">
                        {item.email}
                      </td>
                      <td className="py-2 px-2">
                        {item.userRole == 1 ? "Admin" : "Customer"}
                      </td>
                      <td className="py-2 px-2">
                        {item.createdAt}
                      </td>
                      <td className="py-2 px-2">
                        {item.updatedAt}
                      </td>
                    </tr>
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="12"
                  className="text-xl text-center font-semibold py-8"
                >
                  No Users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-sm text-gray-600 mt-2">
          Total {users && users.length} user found
        </div>
      </div>
    </Fragment>
  );
}

export default AllUsers;
