import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSquareFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { Navbar } from "../components/NavBar/Navbar";
import '../styles/contact.css';
import { Footer } from "../components/Footer/Footer";


export const Contact = () => {
  return (
    <>
    <div className="bg-white bg-cover bg-center w-full h-screen bg-no-repeat flex flex-col overflow-hidden overflow-y-auto">
      <div className="flex-grow flex items-center justify-center pb-10 ">
        <div className="w-full flex justify-center items-center py-1 bg-transparent z-100">
        <Navbar/>
        </div>
      </div>
      <div className="md:pl-20 md:flex-grow-0 md:grid flex flex-col bg-blue-strong-bs md:h-screen grid-cols-2 -mt-10">
          <div className="bg-transparent text-white text-center text-4xl py-4 rounded-lg flex justify-center items-center">
            <div className="font-myriad-pro text-center items-center">
              <h1 className="pb-2">Contactanos</h1>
              <h2 className="pb-10">¡Trabaja con nosotros!</h2>
              <h4 className="pt-10">Si tienes habilidades que crees que podrían complementar nuestro equipo, tienes alguna duda o necesitas contactarte con nosotros, no dudes en ponerte en contacto. Estamos comprometidos en brindar una buena solución a cualquier inquietud. ¡Esperamos escuchar de ti pronto y explorar juntos las oportunidades que tenemos para ofrecer!</h4>
              <h4 className="pt-24 pb-2">Búscanos en redes sociales</h4>
              <div className="items center justify-center">
                  <a href="https://web.facebook.com/ElLokojara/" className="pl-6 ">
                    <FontAwesomeIcon icon={faSquareFacebook} color="#4267B2" fontSize="50px"/>
                  </a>
                  <a href="https://www.instagram.com/blackshark.studios/?hl=es-la" className="pl-6">
                    <FontAwesomeIcon icon={faInstagram} color="#F56040" fontSize="50px"/>
                  </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:pr-20 bg-transparent text-center text-3xl py-4 rounded-lg">
            <div className="items-center pt-24">
              <div className="w-full max-w-md p-10 mx-auto my-6 transition duration-500 ease-in-out transform bg-white rounded-lg md:mt-0">
                <div className="mt-2">
                    <form action="#" method="POST" className="">
                      <div>
                        <div className="text-left pl-5">
                        <label className="font-light text-lg pl-0"> Nombre </label>
                        </div>

                        <div className="mt-1">
                          <input 
                            id="name" 
                            name="name" 
                            type="text" 
                            placeholder="Ingresa tu nombre" 
                            className="w-full pl-5 py-3 text-base text-neutral-600 placeholder-gray-400 transition duration-500 ease-in-out transform border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                          />
                        </div>

                        <div className="text-left pl-5">
                        <label className="font-light text-lg pl-0"> Apellido </label>
                        </div>

                        <div className="mt-1">
                          <input 
                            id="apellido" 
                            name="apellido" 
                            type="text" 
                            placeholder="Ingresa tu apellido" 
                            className="w-full pl-5 py-3 text-base text-neutral-600 placeholder-gray-400 transition duration-500 ease-in-out transform border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                          />
                        </div>

                        <div className="text-left pl-5">
                        <label className="font-light text-lg pl-0"> Correo </label>
                        </div>

                        <div className="mt-1">
                          <input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder="Ingresa tu correo" 
                            className="w-full pl-5 py-3 text-base text-neutral-600 placeholder-gray-400 transition duration-500 ease-in-out transform border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                          />
                        </div>

                        <div className="text-left pl-5">
                          <label className="font-light text-lg pl-0"> Mensaje </label>
                        </div>

                        <textarea className="w-full pl-5 py-3 text-base text-neutral-600 placeholder-gray-400 transition duration-500 ease-in-out transform border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300" ></textarea>
                        <div className="pt-5">
                          <button className="flex items-center justify-center w-full px-[110px] py-2.5 text-xl font-large text-center text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Enviar</button>
                        </div>

                      </div>
                    </form>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}
