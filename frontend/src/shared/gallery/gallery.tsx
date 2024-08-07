import { Navbar } from "../../components/NavBar/Navbar";
import { useEffect, useState } from "react";
import '../../styles/gallery.css';
import { UploadModal } from "./components/uploadModal";
import { ImageModal } from "./components/imagemodal";
import { useProps } from "../../hooks/useProps";
import { useBackend } from "../../hooks/useBackend";
import { GalleryData, Services } from "../../utils/interfaces";
import { Footer } from "../../components/Footer/Footer";
import { UploadGalleryButton } from "./components/uploadGalleryButton";
import { useFirebase } from "../../hooks/useFirebase";
import { useToast } from "@chakra-ui/react";

export const Gallery = () => {

  const { userType, userToken, setServicesData, servicesData, setGalleryData, galleryData } = useProps();
  const { getServices, getGallery, deleteGallery } = useBackend()
  const { deleteImageFromGallery } = useFirebase()
  const toast = useToast()

  const [showModal, setShowModal] = useState(false);

  const [selectedImage, setSelectedImage] = useState<GalleryData | null>(null);
  const [services, setServices] = useState<Services[]>([]);
  const [gallery, setGallery] = useState<GalleryData[]>([]);


  const handleModal = () => {
    setShowModal(prevState => !prevState);
  };

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

  const getGalleryData = async () => {
    try {
      const res =  await getGallery()
      const { data } = res
      setGallery(data)
      setGalleryData(data)
    } catch (error) {
      console.error(error)
    }
  }

  const addGalleryImage = (newImage) => {
    setGallery((prevGallery) => {
      const updatedGallery = prevGallery ? [...prevGallery, newImage] : [newImage];
      setGalleryData(updatedGallery); // Set the new state directly
      return updatedGallery;
    });
  }

  const extractImageNameFromURL = (url) => {
    const decodedURL = decodeURIComponent(url);
    const parts = decodedURL.split('/');
    const fileNameWithToken = parts.pop();
    const fileName = fileNameWithToken.split('?')[0];
    return fileName;
  };

  const deleteGalleryImage = async (image) => {
    const galleryToDelete = gallery.filter(gallery => gallery.id_imagen === image.id_imagen)
    const imagename = extractImageNameFromURL(galleryToDelete[0].imagen_link)
    try {
      const res = await deleteGallery(image.id_imagen, userToken)
      const {status, data} = res
      if (status === 200) {
        deleteImageFromGallery(imagename)
        setSelectedImage(null)
        const updatedGallery = gallery.filter(gallery => gallery.id_imagen !== image.id_imagen)
        setGallery(updatedGallery);
        setGalleryData(updatedGallery);
        successToastNotification(data.message)
      }
    } catch (error) {
      errorToastNotification(error.response.data.message)
      console.error(error)
    }
  };

  const successToastNotification = (message: string) => {
    toast({
      title: message,
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  const errorToastNotification = (message: string) => {
    toast({
      title: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    })
  }

  useEffect(() => {
    if (galleryData.length > 0) {
      setGallery(galleryData);
      console.log("Galeria ya obtenida...");
    } else {
      getGalleryData();
    }

    if (servicesData.length > 0) {
      setServices(servicesData);
      console.log("Servicios ya obtenidos...");
    } else {
      getServicesData();
    }
  }, [])


  return (
    <div className="flex flex-col min-h-screen bg-white bg-cover bg-center bg-no-repeat">
      <Navbar />
      <div className="flex-grow p-5 md:p-10">
        <div className="columns-1 gap-5 lg:gap-8 sm:columns-2 lg:columns-3 xl:columns-4 [&>img:not(:first-child)]:mt-5 lg:[&>img:not(:first-child)]:mt-8">
          {userType === "admin" && userToken && (
            <UploadGalleryButton handleModal={handleModal} />
          )}
          {gallery.map((image) => (
            <img
              key={image.id_imagen}
              src={image.imagen_link}
              alt=""
              className="rounded-lg shadow-md border border-gray-300 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={() => setSelectedImage(image)}
            />
          ))}
          {selectedImage && (
            <ImageModal
              image={selectedImage}
              onClose={() => setSelectedImage(null)}
              deleteImage={deleteGalleryImage}
            />
          )}
          {showModal && (
            <UploadModal
              handleModal={handleModal}
              services={services}
              addGalleryImage={addGalleryImage}
              successToast={successToastNotification}
              errorToast={errorToastNotification}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
