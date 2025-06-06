import { Outlet } from "react-router";
import Navbar from "../../components/navbar/navbar";
// import Carousel from "../../components/carousel/carousel";

const Layout = () => {
    return(
        <>
          <Navbar></Navbar>
          <Outlet />

        </>
    )
  
}

export default Layout;