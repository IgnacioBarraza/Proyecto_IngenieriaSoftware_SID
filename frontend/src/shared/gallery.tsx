import { Link } from "react-router-dom"
import { faChevronLeft} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Navbar } from "../components/NavBar/Navbar";

export const Gallery = () => {
  return (
    <>
    <div className="bg-white bg-cover bg-center w-full h-screen bg-no-repeat flex flex-col overflow-hidden">
      <div className="flex-grow flex items-center justify-center pb-10">
        <div className=" fixed top-0 left-0 p-2">
              <Link to={'/'}>
                <span className="flex items-center justify-center rounded-full w-20 h-20">
                  <FontAwesomeIcon icon={faChevronLeft} size="2xl"/>
                </span>
              </Link>
        </div>
        {/* <div className="text-center text-6xl py-8">
            <h1 className="font-myriad-pro z-40 text-white font-extralight font-size-500 ">Contactanos</h1> 
        </div> */}
        <div className="px-64 py-1 bg-transparent z-100">
        <Navbar/>
        </div>
      </div>
      {/* <div className="w-full max-w-5xl p-5 pb-10 mx-auto mb-10 gap-5 grid grid-cols-3 space-y-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"><div/> */}
      <div className=" p-5 md:p-10">
        <div className="columns-1 gap-5 lg:gap-8 sm:columns-2 lg:columns-3 xl:columns-4 [&>img:not(:first-child)]:mt-5 lg:[&>img:not(:first-child)]:mt-8">
          <img src="/paisaje1.jpg" alt=""/>
          <img src="/paisaje1.jpg" alt=""/>
          <img src="/paisaje1.jpg" alt=""/>
          <img src="/paisaje1.jpg" alt=""/>
          <img src="/paisaje1.jpg" alt=""/>
          <img src="/paisaje1.jpg" alt=""/>
          <img src="/paisaje1.jpg" alt=""/>
          <img src="/paisaje1.jpg" alt=""/>
          <img src="/paisaje1.jpg" alt=""/>
          <img src="/paisaje1.jpg" alt=""/>
          <img src="/paisaje1.jpg" alt=""/>
          <img src="/paisaje1.jpg" alt=""/>
        </div>
      </div>
    </div>
    </>
  )
}
