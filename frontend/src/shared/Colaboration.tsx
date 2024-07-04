import { useEffect, useState } from "react";
import { useProps } from "../hooks/useProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { Colaborations, CreateColaborations, Services, UpdateColaborations} from "../utils/interfaces"
import { useBackend } from "../hooks/useBackend";
import { createMultiStyleConfigHelpers, useToast } from "@chakra-ui/react";
import { useFirebase } from "../hooks/useFirebase";

export const Colaboration = () => {
  
  const { userType, userToken, servicesData, setServicesData, colaborationsData, setColaborationsData} = useProps();
  const {getServices, getColaborations, updateColaborations, deleteColaborations, createColaborations} = useBackend();
  const { deleteImageFromCollaboration, uploadCollaborationImage } = useFirebase()
  const [colaboration, setColaboration] = useState<Colaborations[]>([]);
  const [services, setServices] = useState<Services[]>([]);
  const toast = useToast()
  
  const [showModal, setShowModal] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState('')


  const getColaboration = async () => {
    try {
      const res = await getColaborations()
      const { status, data } = res;
      if(status === 200){
        setColaboration(data)
        setColaborationsData(data)
      }

    } catch (error) {
      console.log(error)
    }
  }

const handleModal = () => {
  setShowModal(prevState => !prevState)
}

const handleUpload = async () => {    
    if (url) {
      const formattedIds = JSON.stringify(selectedServices);
      const newCollaboration: Colaborations = {
        nombre_empresa: companyName,
        id_servicios: formattedIds,
        imagen_link: url,
      }
      try {
          const res = await createColaborations(newCollaboration, userToken)
          const { status, data } = res;
          if (status === 201) {
            successToastNotification(data.message);
          }
      } catch (error) {
          errorToastNotification(error.response.data.message)
      }
    }

    // console.log(colaboration)
    // console.log(selectedServices)
//   if (colaboration[0].fecha_colaboracion === '') return errorToastNotification("Debe ingresar una fecha para la colaboracion");
//   if (colaboration[0].imagen_link === '') return errorToastNotification("Debe ingresar una imagen para la colaboracion");
//   if (colaboration[0].id_servicios === '') return errorToastNotification("Debe ingresar un servicio ejercido en la colaboracion");
//   if (colaboration[0].nombre_empresa === '') return errorToastNotification("Debe ingresar el nombre de la empresa a la que se realizo la colaboracion");
//   uploadCollaborationImage(
//     image,
//     (progress) => setProgress(progress),
//     (error) => setError(error),
//     (downloadURL) => setUrl(downloadURL)
//   );
//   setImage(null);
};

const handleImageUpload = () => {
  if (selectedServices.length === 0) return alert('Debes seleccionar al menos un servicio asociado a la colaboración!');
  uploadCollaborationImage(
    image,
    (progress) => setProgress(progress),
    (error) => setError(error),
    (downloadUrl) => setUrl(downloadUrl)
  );
  setImage(null);
}

const handleImageFileUpload = (e) => {
  if (e.target.files[0]) {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }
};
const removeImage = () => {
  setImage(null);
  setPreview(null);
};

  const handleChangeColabData = ({ target: { name, value } }) => {
    setColaboration({...colaboration, [name]: value})
  }

  const extractImageNameFromURL = (url) => {
    const decodedURL = decodeURIComponent(url);
    const parts = decodedURL.split('/');
    const fileNameWithToken = parts.pop();
    const fileName = fileNameWithToken.split('?')[0];
    return fileName;
  };

  const handleAddColaboration = (newCollaboration) => {
    setColaboration((prevColaboration) => {
      const updatedColaboration = prevColaboration ? [...prevColaboration, newCollaboration] : [newCollaboration];
      setColaborationsData(updatedColaboration); // Set the new state directly
      return updatedColaboration;
    });
  };

//   const uploadCollaboration = async () => {
//     const newCollaboration: CreateColaborations = {
//       nombre_empresa: colaboration[0].nombre_empresa,
//       fecha_colaboracion: colaboration[0].fecha_colaboracion,
//       id_servicios: colaboration[0].id_servicios,
//       imagen_link: url
//     }
//     try {
//       const res = await createColaborations(newCollaboration, userToken)
//       const { status, data } = res
//       if (status === 201) {
//         successToastNotification(data.message)
//         const transformedColaboration = {
//           ...newCollaboration,
//           id_servicios: data.id // Add id_servicios to the services
//         };
//         handleAddColaboration(transformedColaboration);
//       }
//     } catch (error) {
//       console.error(error)
//       errorToastNotification(error.response.data.message)
//     }
//   }
//   const deleteCollaborationsImage = async (id_collaboration) => {
//     const collaborationToDelete = colaboration.filter(colaboration =>colaboration[0].id_collaboration === id_collaboration)
//     const imagename = extractImageNameFromURL(collaborationToDelete.id_collaboration)
//     try{
//       const res =await deleteColaborations(id_collaboration, userToken)
//       const {status, data} = res
//       if(status === 200){
//         deleteImageFromCollaboration(imagename)
//         const updateColaborations = colaboration.filter(colaboration => colaboration.id_collaboration !== id_collaboration)
//         setColaboration(updateColaborations);
//         setColaborationsData(updateColaborations);
//         successToastNotification(data.message)

//       }
//     } catch(error){
//       errorToastNotification(error.response.data.message)
//       console.error(error)
//     }

  const errorToastNotification = (message: string) => {
    toast({
      title: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    })
  }

  const successToastNotification = (message: string) => {
    toast({
      title: message,
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

//   const UpdateColaborations = async (id_collaboration: string, updatedColaborations: UpdateColaborations) => {
//     const originalColaborations = [...colaborationsData]
//     const updateColaboration = colaborationsData.map(colaboration => {
//       if (colaboration.id_collaboration === id_collaboration) {
//         return {
//             ...colaboration,
//             nombre_empresa: Colaboration[0].nombre_empresa,
//             imagen_link: Colaboration[0].imagen_link,
//             fecha_colaboracion: Colaboration[0].fecha_colaboracion
//         }
//       }
//       return colaboration;
//     })

    // Optimistically updating the items:
//     setColaboration(updateColaboration);
//     setColaborationsData(updateColaboration);

//     try {
//       const res = await updateColaborations(id_collaboration, userToken, updatedColaborations);
//       const { status, data } = res;
//       if (status === 200) {
//         successToastNotification(data.message);
//       }
//       return true
//     } catch (error) {
//         errorToastNotification(error.response.data.message);
//         console.log('There was an error updating the tool: ', error);

//         // If theres an error, go back to the previous data:
//         setColaboration(originalColaborations)
//         setColaborationsData(originalColaborations)
//         return false
//     }
//   }

  const getServicesData = async () => {
    try {
      const res = await getServices();
      const { data } = res
      setServices(data);
      setServicesData(data)
    } catch (error) {
      console.error(error);
    }
  };

  const handleServiceSelection = (serviceId: string) => {
    if (!selectedServices.includes(serviceId)) {
      setSelectedServices((prev) => [...prev, serviceId]);
    }
    setDropdownOpen(false);
  };

  const removeSelectedService = (id: string) => {
    setSelectedServices((prev) => prev.filter((serviceId) => serviceId !== id));
  };

  useEffect(() => {
    if (colaborationsData.length > 0) {
      setColaboration(colaborationsData)
      console.log("Colaboraciones ya obtenidas...")
    } else {
      getColaboration();
    }

    if (servicesData.length > 0) {
      setServices(servicesData);
      console.log("Servicios para las colaboraciones ya obtenidas...");
    } else {
      getServicesData();
    }
}, [])

useEffect(() => {
    if (url && progress === 100) {
        handleUpload();
        console.log('test')
    }
  }, [url])

  return (
    <>
      <div className="flex justify-center bg-gray-100 fit w-full">
        <div className=" grid grid-cols-2 gap-20 py-10">
          {userType === "admin" && userToken && (
            <button onClick={handleModal} className="w-[100px] md:w-[300px] h-64 flex items-center justify-center rounded-lg shadow-md border hover:bg-gray-200 border-gray-300 transition duration-300 ease-in-out transform hover:scale-105">
              <div className="flex flex-col items-center justify-center space-y-4">
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ color: "#000000" }}
                  size="8x"
                />
                <h2 className="text-lg font-bold mb-2 text-center">Agregar Colaboracion</h2>
              </div>
            </button>
          )}
  
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 sm:px-0 z-10">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-md">
                <h2 className="font-myriad-pro text-xl font-bold mb-4 text-center">
                  Agregar Nueva Colaboración
                </h2>
                <div className="mt-6 mb-4">
                  <input
                    id="collabName"
                    name="collabName"
                    type="text"
                    placeholder="Ingresa el nombre de la empresa"
                    className="w-full pl-5 py-3 text-base text-neutral-600 placeholder-gray-400 transition duration-500 ease-in-out transform border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                    onChange={event => setCompanyName(event.target.value)}
                  />
                </div>
                
                {/*  */}
                {services.length > 0 && (
                    <>
                        <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="w-full px-4 py-2 text-left bg-gray-200 rounded-md"
                        >
                            Selecciona un servicio
                        </button>
                        {dropdownOpen && (
                            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
                            {services.map((service) => (
                                <div
                                key={service.id_servicios}
                                onClick={() =>
                                    handleServiceSelection(service.id_servicios)
                                }
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                >
                                {service.nombre}
                                </div>
                            ))}
                            </div>
                        )}
                        </div>
                        <div className="mt-4">
                        {selectedServices.map((serviceId) => {
                            const service = services.find(
                                (s) => s.id_servicios === serviceId
                            );
                            return (
                            <div
                                key={serviceId}
                                className="flex items-center justify-between mb-2 p-2 bg-gray-200 rounded"
                            >
                                <span>{service?.nombre}</span>
                                {progress !== 100 && (
                                <button
                                    onClick={() => removeSelectedService(serviceId)}
                                    className="text-red-500"
                                >
                                    <FontAwesomeIcon icon={faXmarkCircle} size="xl" />
                                </button>
                                )}
                            </div>
                            );
                        })}
                        </div>
                    </>
                    )}
                    {/*  */}

                <div className="border-dashed border-4 border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center space-y-4 mt-4">
                  {!preview ? (
                    <>
                      <input
                        type="file"
                        className="hidden"
                        id="image-upload"
                        onChange={handleImageFileUpload}
                      />
                      <label
                        htmlFor="image-upload"
                        className="font-myriad-pro cursor-pointer p-2 bg-gray-100 rounded hover:bg-gray-200 transition"
                      >
                        Arrastra la imagen aquí o haz clic para subirla
                      </label>
                    </>
                  ) : (
                    <div className="relative">
                      <img src={preview} alt="Preview" className="w-full h-auto" />
                      {progress !== 100 && (
                        <button
                          onClick={removeImage}
                          className="absolute top-0 right-0 mt-2 mr-2 bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 transition"
                        >
                          Eliminar
                        </button>
                      )}
                      </div>
                  )}
                </div>
                <div className="flex justify-center mt-4 flex-col">
                  {progress !== 100 && (
                      <button
                      onClick={handleImageUpload}
                      className="font-myriad-pro mt-4 bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-900 transition flex flex-col items-center"
                      >
                      Guardar
                      </button>
                  )}
                  <button
                      onClick={handleModal}
                      className="font-myriad-pro mt-4 bg-red-800 text-white py-2 px-4 rounded hover:bg-red-900 transition flex flex-col items-center"
                  >
                    Cerrar
                  </button>
                </div>
                {progress > 0 && (
                <div className="mt-4">
                    <progress value={progress} max="100" className="w-full"></progress>
                    {progress === 100 && (
                    <p className="text-green-600 mt-2">
                        ¡Imagen subida exitosamente!
                    </p>
                    )}
                    {error && (
                    <div className="text-red-600 mt-2">Error: {error.message}</div>
                    )}
                </div>
                )}
                {/* <div className="flex justify-center mt-4">
                  <div
                    onClick={handleModal}
                    className=" hover:text-gray-900 text-medium"
                    >
                    Cancelar
                  </div>
                </div> */}
              </div>
            </div>
          )}
          {colaboration.map((colaboration, index) => (
              <div key={index} className="flex flex-col items-center">
                <img src={colaboration.imagen_link} alt={`Logo ${index}`} className="h-64 w-64 flex items-center justify-center text-white font-bold rounded-lg object-cover" />
                <p className="mt-2 text-center">{colaboration.nombre_empresa}</p>
              </div>
          ))}
        </div>
      </div>
    </>
  );
};