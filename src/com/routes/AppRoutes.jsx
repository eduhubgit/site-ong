import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import RegisterONG from "../pages/RegisterONG";
import RegisterUser from "../pages/RegisterUser";

import ONGHome from "../pages/ONGHome";
import ONGProfile from "../pages/ONGProfile";

import UserHome from "../pages/UserHome";
import UserProfile from "../pages/UserProfile";

import CreateNeed from "../pages/CreateNeed";
import PublishedNeeds from "../pages/PublishedNeeds";
import ReceivedDonations from "../pages/ReceivedDonations";

import DonationMessage from "../pages/DonationMessage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<RegisterONG />} />
        <Route path="/register-user" element={<RegisterUser />} />

        <Route path="/home" element={<ONGHome />} />
        <Route path="/usuario-home" element={<UserHome />} />

        <Route path="/perfil-ong" element={<ONGProfile />} />
        <Route path="/perfil-usuario" element={<UserProfile />} />

        <Route path="/publicar-necessidades" element={<CreateNeed />} />
        <Route path="/necessidades-publicadas" element={<PublishedNeeds />} />
        <Route path="/doacoes-recebidas" element={<ReceivedDonations />} />

        <Route path="/doar/:id" element={<DonationMessage />} />
        <Route path="/contribuir/:id" element={<DonationMessage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;