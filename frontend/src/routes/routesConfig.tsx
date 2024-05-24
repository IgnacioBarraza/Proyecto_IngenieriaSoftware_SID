import { Login } from "../auth/login";
import { Register } from "../auth/register";
import { Recoverpassword } from "../components/RecoverPasswordModal/recoverpassword";
import { Contact } from "../shared/contact";
import { Gallery } from "../shared/gallery";
import { Homepage } from "../shared/homepage";
import { Servicios } from "../shared/servicios";

export const routes = [
  {
    path: '/',
    component: <Homepage />
  },
  {
    path: '/login',
    component: <Login />
  },
  {
    path: '/signup',
    component: <Register />
  },
  {
    path: '/contact',
    component: <Contact />
  },
  {
    path: '/gallery',
    component: <Gallery />
  },
  {
    path: '/servicios',
    component: <Servicios />
  },
  {
    path: '/recoverpassword',
    component: <Recoverpassword />
  },
]