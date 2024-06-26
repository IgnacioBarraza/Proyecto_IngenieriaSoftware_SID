import { useState, createContext, useEffect } from "react"
import { Equipment, GalleryData, Services, ServicesShoppingCart, ShoppingCart } from "../utils/interfaces"

type UserDataProviderType = {
  setUserType: (userType: string) => void
  userType: string | null
  setTokenData: (token: string) => void
  userToken: string | null
  setUserName: (username: string) => void
  userName: string | null
  logout: () => void
  setServicesData: (servicesData: Services[]) => void
  servicesData: Services[] | null
  setGalleryData: (galleyData: GalleryData[]) => void
  galleryData: GalleryData[] | null
  setShoppingCartData: (shoppingCartData: Services[]) => void
  shoppingCartData: ServicesShoppingCart[] | null
  setUserId: (id_usuario: string) => void
  userId: string | null
  setToolsData: (toolsData: Equipment[]) => void
  toolsData: Equipment[] | null
  loginData: (token: string, tipo_user: string, username: string, user_id: string) => void
}

export const PropsContext = createContext<UserDataProviderType>({
  setUserType: () => {},
  userType: null,
  setTokenData: () => {},
  userToken: null,
  setUserName: () => {},
  userName: null,
  logout: () => {},
  setServicesData: () => {},
  servicesData: null,
  setGalleryData: () => {},
  galleryData: null,
  setShoppingCartData: () => {},
  shoppingCartData: null,
  setUserId: () => {},
  userId: null,
  setToolsData: () => {},
  toolsData: null,
  loginData: () => {}
})

export const PropsDataProvider = ({ children }) => {
  const [userType, setUserType] = useState<string | null>(localStorage.getItem("userType") || "");
  const [userToken, setTokenData] = useState<string | null>(localStorage.getItem("token") || "");
  const [userName, setUserName] = useState<string | null>(localStorage.getItem("userName") || "");
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("userid") || "");
  const [servicesData, setServices] = useState<Services[] | null>([]);
  const [galleryData, setGallery] = useState<GalleryData[] | null>([]);
  const [shoppingCartData, setShoppingCart] = useState<ServicesShoppingCart[]>([]);
  const [toolsData, setTools] = useState<Equipment[]>([]);

  useEffect(() => {
    localStorage.setItem("userType", userType || "");
    localStorage.setItem("token", userToken || "");
    localStorage.setItem("userName", userName || "");
    localStorage.setItem("userid", userId || "");
  }, [userType, userToken, userName, userId]);

  const setUserData = (userType: string, username: string, id_user: string) => {
    setUserType(userType);
    setUserName(username);
    setUserId(id_user);
  };

  const setUserToken = (token: string) => {
    setTokenData(token);
  };

  const logout = () => {
    setUserName(null);
    setTokenData(null);
    setUserType(null);
    setUserId(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userName");
    localStorage.removeItem("userid");
  };

  const loginData = (token: string, tipo_user: string, username: string, user_id: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userType", tipo_user);
    localStorage.setItem("userName", username);
    localStorage.setItem("userId", user_id);
    setUserType(tipo_user);
    setTokenData(token);
    setUserName(username);
    setUserId(user_id);
  };

  const setServicesData = (servicesData: Services[]) => setServices(servicesData);
  const setGalleryData = (galleryDataData: GalleryData[]) => setGallery(galleryDataData);
  const setShoppingCartData = (shoppingCartData: ServicesShoppingCart[]) => setShoppingCart(shoppingCartData);
  const setToolsData = (toolsData: Equipment[]) => setTools(toolsData);

  return (
    <PropsContext.Provider value={{ 
      userType, setUserType,
      userToken, setTokenData, 
      userName, setUserName, 
      servicesData, setServicesData, 
      logout, loginData, 
      galleryData, setGalleryData, 
      shoppingCartData, setShoppingCartData, 
      userId, setUserId,
      toolsData, setToolsData
    }}>{children}</PropsContext.Provider>
  );
};
