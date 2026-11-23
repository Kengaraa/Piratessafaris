import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Packages from "./pages/Packages";
import PackageDetail from "./pages/PackageDetail";
import Gallery from "./pages/Gallery";
import Book from "./pages/Book";
import { Login, Register } from "./pages/Auth";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import { useAuth } from "./lib/auth";
import { Spinner } from "./components/UI";

function Guard({ admin, children }) {
  const { user, isAdmin, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <Spinner />;
  if (!user)
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (admin && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="packages" element={<Packages />} />
        <Route path="packages/:slug" element={<PackageDetail />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="book" element={<Book />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="account"
          element={
            <Guard>
              <Account />
            </Guard>
          }
        />
        <Route
          path="admin"
          element={
            <Guard admin>
              <Admin />
            </Guard>
          }
        />
        <Route
          path="*"
          element={
            <div className="container-x py-24 text-center">
              <h1 className="text-3xl font-bold">Page not found</h1>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
