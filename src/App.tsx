import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Search from "./pages/Search";
import Match from "./pages/Match";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import React from "react";
import Favorites from "./pages/Favorites";
import PrivateRoute from "./components/PrivateRoute";


function App() {
  return (
    <Provider store={store}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/search" element={<Search />} />
            <Route path="/match" element={<Match />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
          <Route path="*" element={<Login />} />
        </Routes>
    </Provider>
  );
}

export default App;
