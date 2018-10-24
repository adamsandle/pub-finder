import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducer/rootReducer";

const persistedState = localStorage.getItem("reduxState")
  ? JSON.parse(localStorage.getItem("reduxState"))
  : {};
export default function configureStore(initialState = {}) {
  const store = createStore(
    rootReducer,
    persistedState,
    applyMiddleware(thunk)
  );

  store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem("reduxState", JSON.stringify(state));
  });

  return store;
}
