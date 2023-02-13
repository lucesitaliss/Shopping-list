import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLocalStoreToken } from "../../../../../features/localStoreToken/localStoreTokenSlice";
import localStoreToken from "../../../../Utils/localStoreToken";
import { getApiUrl } from "../../../../../api";
import { BiEditAlt } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";
import "./adminTabUser.css";

export default function AdminTabUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLocalStoreToken(localStoreToken()));
  }, []);

  useEffect(() => {
    getUsers();
  }, []);

  const { tokenLocalStore } = useSelector((state) => state.localStoreToken);

  const [dataCreateUser, setDataCreateUser] = useState({
    name: "",
    password: "",
  });

  const [users, setUsers] = useState([]);

  const handlechange = (event) => {
    const { name, value } = event.target;
    setDataCreateUser({ ...dataCreateUser, [name]: value });
  };

  const handleSumit = async (event) => {
    event.preventDefault();
    const urlNewUser = getApiUrl("newuser");
    const getNewUser = await fetch(urlNewUser, {
      method: "POST",
      body: JSON.stringify(dataCreateUser),
      headers: {
        "content-type": "application/json",
        "x-acces-token": tokenLocalStore,
      },
    });
    if (getNewUser.ok) {
       getUsers();
    }
    event.target.reset();
  };

  const getUsers = async () => {
    const urlGetUsers = getApiUrl("users");
    try {
      const usersRequest = await fetch(urlGetUsers, {
        headers: { "x-acces-token": tokenLocalStore },
      });
      if (usersRequest.ok) {
        const usersResponse = await usersRequest.json();
        setUsers(usersResponse);
      }
    } catch (error) {}
  };

  const handleOnClickEditUser = async (currentUser, id) => {
    const { value: editUser } = await Swal.fire({
      title: "Edit User",
      input: "text",
      inputLable: "Insert User",
      inputValue: currentUser,
      showCancelButton: true,
    });
    if (editUser) {
      const bodyupdateUser = {
        user: editUser,
        id: id,
      };
      updatedUser(bodyupdateUser);
      await Swal.fire({
        text: "The user has been successfully modified",
        icon: "sucess",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  };
  const updatedUser = async (bodyupdateUser) => {
    const urlUpdateUser = getApiUrl("updateuser");
    try {
      const getUpdateUser = await fetch(urlUpdateUser, {
        method: "PUT",
        body: JSON.stringify(bodyupdateUser),
        headers: {
          "content-type": "application/json",
          "x-acces-token": tokenLocalStore,
        },
      });
      if (getUpdateUser.ok) {
        getUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleOnClickDeleteUser = async (id, user) => {
    try {
      const SwalDelete = await Swal.fire({
        title: "DeleteUser",
        text: `Are you sure you want to delete the user ${user}`,
        icon: "info",
        showCancelButton: true,
      });
      if (SwalDelete) {
        deleteUser(id);
        Swal.fire({
          text: "The user has been deleted successfully",
          icon: "secess",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const urlDeleteUser = getApiUrl(`deleteuser/${id}`);
      const getDeleteUser = await fetch(urlDeleteUser, {
        method: "DELETE",
        headers: {
          "x-acces-token": tokenLocalStore,
        },
      });
      if (getDeleteUser.ok) {
        getUsers();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSumit} className="userAdminForm">
        <input
          placeholder="Username"
          name="name"
          onChange={handlechange}
          className="inputForm"
        />
        <input
          placeholder="Password"
          name="password"
          onChange={handlechange}
          className="inputForm"
        />
        <input type="submit" value="Create user" className="butonForm" />
      </form>
      {users.map((user) => (
        <div className="listUsers" key={user.user_id}>
          <BiEditAlt
            onClick={() => {
              handleOnClickEditUser(user.user_name, user.user_id);
            }}
          />
          <RiDeleteBin6Line
            onClick={() => {
              handleOnClickDeleteUser(user.user_id, user.user_name);
            }}
          />
          {user.user_name}
        </div>
      ))}
    </div>
  );
}