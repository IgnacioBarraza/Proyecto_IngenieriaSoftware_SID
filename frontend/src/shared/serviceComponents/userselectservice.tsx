export const UserService = ({ selectedServicio, handleClickOutside, handleCloseModal, addToCart }) => {
    const handleAddToCart = () => {
      addToCart({ service: selectedServicio.title, price: selectedServicio.price });
    };
  
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-container" onClick={handleClickOutside}>
          <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 h-3/4 md:h-auto rounded-lg p-4 md:p-8 flex flex-col md:flex-row overflow-y-auto">
            <div className="w-full md:w-1/2 h-64 md:h-auto flex items-center justify-center">
              <img
                src={selectedServicio.imgSrc}
                alt={selectedServicio.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="md:w-1/2 p-4 md:p-8">
              <h2 className="text-2xl font-bold mb-4">{selectedServicio.title}</h2>
              <p>{selectedServicio.description}</p>
              <button
                className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={handleAddToCart}
              >
                Agregar al Carrito
              </button>
              <button
                className="flex content-end mt-8 px-4 py-2 bg-blue-500 text-white rounded-lg"
                onClick={handleCloseModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
  