// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <>
        <div className="flex items-center justify-center">
            <div className="flex items-center space-x-16 ">
                <Link to={'/servicios'}>   
                <span className="font-myriad-pro font-medium transition duration-500 transform hover:scale-110 px-2 mr-7 text-2xl flex items-center justify-center">Servicios</span>
                </Link>
                <Link to={'/gallery'} className="font-myriad-pro font-medium transition duration-500 transform hover:scale-110 text-2xl px-2 mr-7 flex items-center justify-center">
                <span>Galería</span>
                </Link>
                <a href="#" className="font-myriad-pro font-medium transition duration-500 transform hover:scale-110 px-2 mr-7 text-2xl flex items-center justify-center">Portafolio</a>
                <div className="w-28 h-28 z-100">
                <img src="/BlackShark.png" alt="Blackshark logo" />
                </div>
                {/* <a href="#" className="font-myriad-pro font-semibold text-white transition duration-500 transform hover:scale-110 text-base px-2">Portafolio</a> */}
                <Link to={'/contact'} className="font-myriad-pro font-medium  transition duration-500 transform hover:scale-110 text-2xl px-2 mr-7 flex items-center justify-center">
                <span >Contacto</span>
                </Link>
                <Link to={'/login'} className="font-myriad-pro font-medium  transition duration-500 transform hover:scale-110 text-2xl px-2 mr-7 flex items-center justify-center">
                  <span>Iniciar Sesión</span>
                </Link>
                <Link to={'/signup'} className="border px-4 py-1.5 rounded-md border-black font-myriad-pro font-medium  transition duration-500 transform hover:scale-110 text-2xl mr-7 flex items-center justify-center">
                  <span >Registrarse</span>
                </Link>
            </div>
        </div>
    </>
  )
}
