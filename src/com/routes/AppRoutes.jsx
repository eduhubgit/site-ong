
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import RegisterONG from "../pages/RegisterONG";
import ONGHome from "../pages/ONGHome";
import ONGProfile from "../pages/ONGProfile";
import CreateNeed from "../pages/CreateNeed";
import PublishedNeeds from "../pages/PublishedNeeds";
import ReceivedDonations from "../pages/ReceivedDonations";


function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterONG />} />
        <Route path="/home" element={<ONGHome />} />
        <Route path="/perfil-ong" element={<ONGProfile />} />

        <Route path="/publicar-necessidades" element={<CreateNeed />} />
        <Route path="/necessidades-publicadas" element={<PublishedNeeds />} />
        <Route path="/doacoes-recebidas" element={<ReceivedDonations />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;