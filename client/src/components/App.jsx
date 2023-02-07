import React from "react";
import { Provider } from 'react-redux';
import store from "../store";
import AppRoutes from "./AppRoutes";

const App = () => (
    <div className="container">
      <Provider store={store}>
        <AppRoutes/>
      </Provider>
    </div>
  );

export default App;
