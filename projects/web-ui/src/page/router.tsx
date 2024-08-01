import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "./Home";
import MeetRoom from "./MeetRoom";

type BrowserRoutes = ReturnType<typeof createBrowserRouter>;
const AppRoutes: BrowserRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/room/:id",
    loader: ({ params }) => {
      console.log(params.id);
      return "";
    },
    element: <MeetRoom />,
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export default AppRoutes;
