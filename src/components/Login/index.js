import React, { useEffect, useState } from "react"
import { getApiUrl } from "../../api"
import { useSelector, useDispatch } from "react-redux"
import { getLocalStoreToken } from "../../features/localStoreToken/localStoreTokenSlice"
import localStoreToken from "../Utils/localStoreToken"
import "./login.css"
import { Redirect } from "react-router-dom"

export default function Login() {
  const [dataLogin, setDataLogin] = useState({
    name: "",
    password: "",
  })
  const [redirectCart, setRedirectCart] = useState(false)
  const dispatch = useDispatch()
  const { tokenLocalStore } = useSelector((state) => state.localStoreToken)

  useEffect(() => {
    dispatch(getLocalStoreToken(localStoreToken()))
  }, [])

  const handlechange = (event) => {
    const { name, value } = event.target
    setDataLogin({ ...dataLogin, [name]: value })
  }

  const handleSumitLogin = async (event) => {
    event.preventDefault()
    const urlLoging = getApiUrl("login")
    const response = await fetch(urlLoging, {
      method: "POST",
      body: JSON.stringify(dataLogin),
      headers: { "content-type": "application/json" },
    })
    event.target.reset()
    const token = await response.json()

    if (token) {
      localStorage.setItem("token", token)
      dispatch(getLocalStoreToken(token))
      setRedirectCart(true)
    }
  }

  return (
    <form className="loginForm" onSubmit={handleSumitLogin}>
      <input placeholder="Enter the user" name="name" onChange={handlechange} />
      <input
        placeholder="Enter the password"
        name="password"
        onChange={handlechange}
      />
      <input
        className={!tokenLocalStore ? "accepButton" : "accepButtonDisable"}
        type="submit"
        value="Login"
        disable={tokenLocalStore}
      />
      {redirectCart ? <Redirect to="/" /> : null}
    </form>
  )
}