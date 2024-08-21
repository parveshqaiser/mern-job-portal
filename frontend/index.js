import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/app";
import { Provider } from "react-redux";

import reduxStore from "./src/shared/reduxStore";

let root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <Provider store={reduxStore}>
            <App />
        </Provider>
    </React.StrictMode>
)