import { useEffect, useState } from "react";
import { Navbar } from "../../components/NavBar/Navbar";
import { useProps } from "../../hooks/useProps";
import { UploadServiceModal } from "./components/uploadServiceModal";
import { useBackend } from "../../hooks/useBackend";
import { Services } from "../../utils/interfaces";
import { Footer } from "../../components/Footer/Footer";
import { UploadButton } from "./components/uploadButton";
import { SelectedServiceModal } from "./components/selectedServiceModal";
import { useFirebase } from "../../hooks/useFirebase";

export const Servicios = () => {
  const { userType, userToken, servicesData, setServicesData } = useProps();
  const { getServices, deleteService } = useBackend();
  const { deleteImageFromServices } = useFirebase()

  const [showInterface, setShowInterface] = useState(false);
  const [selectedService, setSelectedService] = useState<Services>(null);
  const [services, setServices] = useState<Services[]>([]);

  const handleInterface = () => {
    setShowInterface((prevState) => !prevState);
  };

  const handleServiceClick = (servicio) => {
    const transformedService = {
      ...servicio,
      id_servicios: servicio.id_servicios // Add id_servicios to selectedService
    };
    setSelectedService(transformedService);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  const handleClickOutside = (event) => {
    if (event.target.classList.contains("modal-container")) {
      handleCloseModal();
    }
  };
  const getServicesData = async () => {
    try {
      const res = await getServices();
      setServices(res.data);
      setServicesData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const extractImageNameFromURL = (url) => {
    const decodedURL = decodeURIComponent(url);
    const parts = decodedURL.split('/');
    const fileNameWithToken = parts.pop();
    const fileName = fileNameWithToken.split('?')[0];
    return fileName;
  };

  const handleDeleteService = async (id_servicios) => {
    const serviceToDelete = services.filter(service => service.id_servicios === id_servicios)
    const imageName = extractImageNameFromURL(serviceToDelete[0].imagen_link);
    try {
      const res = await deleteService(id_servicios, userToken)
      const {status, data} = res
      if (status === 200) {
        alert(data.message)
        deleteImageFromServices(imageName)
        setSelectedService(null)
        const updatedServices = services.filter(service => service.id_servicios !== id_servicios);
        setServices(updatedServices);
        setServicesData(updatedServices);
      }
    } catch (error) {
      alert(error.response.data.message)
    }
  };

  const handleAddService = (newService) => {
    setServices((prevServices) => {
      const updatedServices = prevServices ? [...prevServices, newService] : [newService];
      setServicesData(updatedServices); // Set the new state directly
      return updatedServices;
    });
  };

  useEffect(() => {
    if (servicesData.length > 0) {
      setServices(servicesData);
      return console.log("Servicios ya obtenidos..."); // Don't delete!
    }
    getServicesData();
  }, []);

  return (
    <>
      <div className="bg-white bg-cover bg-center w-full min-h-screen bg-no-repeat flex flex-col">
        <Navbar />
        <div className="flex-grow mx-auto mt-8 mb-20">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 ml-4 mr-4 md:ml-24 md:mr-24">
            {userType === "admin" && userToken && (
              <UploadButton handleInterface={handleInterface} />
            )}
            {showInterface && (
              <UploadServiceModal
                handleInterface={handleInterface}
                addService={handleAddService}
              />
            )}
            {services.map((service) => (
              <div
              key={service.id_servicios}
              className="bg-white rounded-lg shadow-lg transition-shadow hover:shadow-xl cursor-pointer"
              onClick={() => handleServiceClick(service)}
            >
              <img
                src={service.imagen_link}
                alt={service.nombre}
                className="w-full h-48 sm:h-64 md:h-64 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold mb-2">{service.nombre}</h2>
              </div>
            </div>
            ))}
          </div>
        </div>
        {selectedService && (
          <SelectedServiceModal
            handleClickOutside={handleClickOutside}
            handleCloseModal={handleCloseModal}
            selectedService={selectedService}
            handleDeleteService={handleDeleteService}
          />
        )}
        <Footer />
      </div>
    </>
  );
};
