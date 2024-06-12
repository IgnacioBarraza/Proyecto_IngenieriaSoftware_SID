import { useEffect, useState } from "react";
import { useFirebase } from "../../hooks/useFirebase";

export const UploadToolsModal = ({ handleInterface }) => {
  const { uploadServiceImage } = useFirebase(); //Cambiar esto para el equipo

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState("");
  const [tool, setTool] = useState({
    toolName: ''
  })

  const handleUpload = () => {
    uploadServiceImage( //Cambiar esto para el equipo
      image,
      (progress) => setProgress(progress),
      (error) => setError(error),
      (downloadURL) => setUrl(downloadURL)
    );
    setImage(null);
  };

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

  const handleUploadToolInput = ({ target: { name, value } }) => {
    setTool({...tool, [name]: value})
  }

  const uploadTool = () => {
    const newTool = {
      toolName: tool.toolName,
      url: url
    }
    console.log(newTool)
  }

  useEffect(() => {
    if (url && progress === 100) {
      uploadTool();
    }
  }, [progress, url]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 sm:px-0">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-md">
        <h2 className="font-myriad-pro text-xl font-bold mb-4 text-center">
          Agregar nuevo equipo
        </h2>
        <div>
          <div>
            <div className="mt-6">
              <input
                id="toolName"
                name="toolName"
                type="text"
                placeholder="Ingresa el nombre del equipo"
                className="w-full pl-5 py-3 text-base text-neutral-600 placeholder-gray-400 transition duration-500 ease-in-out transform border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-300"
                onChange={handleUploadToolInput}
              />
            </div>

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

            <div className="pt-5">
              <button
                onClick={handleUpload}
                className="flex items-center justify-center w-full px-[110px] py-2.5 text-xl font-large text-center text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Guardar
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleInterface}
                className=" hover:text-gray-900 text-medium"
              >
                Cancelar
              </button>
            </div>
            {progress > 0 && (
              <div className="mt-4">
                <progress
                  value={progress}
                  max="100"
                  className="w-full"
                ></progress>
                {progress === 100 && (
                  <p className="text-green-600 mt-2">
                    ¡Imagen subida exitosamente!
                  </p>
                )}
                {error && (
                  <div className="text-red-600 mt-2">
                    Error: {error.message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};