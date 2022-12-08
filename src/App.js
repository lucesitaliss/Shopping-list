import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
//import Home from './components/Home/index.js'
import Cart from "./components/Cart/index";
import Admin from "./components/Admin/index";
import Navbar from "./components/Navbar/Navbar";
import NewCart from "./components/NewCart/index";
import { Provider } from "react-redux";
import { store } from "../src/app/store";

export default function App() {
  return (
    // <Provider store={store}>
    //   <BrowserRouter>
    //     <Navbar />
    //     <Routes>
    //       <Route path="/" element={<Cart />} />
    //       <Route path="/newcart" element={<NewCart />} />
    //       <Route path="/admin" element={<Admin />} />
    //     </Routes>
    //   </BrowserRouter>
    // </Provider>

    <Provider store={store}>
      <Router>
        <Navbar />
        <Route exact path="/">
          <Cart />
        </Route>

        <Route path="/newcart">
          <NewCart />
        </Route>

        <Route path="/newcart">
          <Admin />
        </Route>
      </Router>
    </Provider>
  );
}
