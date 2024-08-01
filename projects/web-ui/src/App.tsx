import { RouterProvider } from "react-router-dom";
import AppRoutes from "./page/router";

function App() {
  return <RouterProvider router={AppRoutes} />;
}

export default App;
