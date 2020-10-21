import React from "react";
import { useQuery, gql } from "@apollo/client";

import { useRouter } from "next/router";

const GET_USER = gql`
  query getUsuario {
    getUsuario {
      id
      nombre
      apellido
    }
  }
`;

const Header = () => {
  const { data, loading, error } = useQuery(GET_USER);

  const router = useRouter();

  if (loading) return null;

  const { nombre, apellido } = data.getUsuario;

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      <div className="flex justify-between mb-6">
        <p className="mr-2 mb-5 lg:mb-0">Hola: {nombre}</p>
        <button
          type="button"
          onClick={() => cerrarSesion()}
          className="bg-red-600 w-full sm:w-auto font-bold text-xs rounded py-2 px-2 text-white shadow-md"
        >
          Cerrar Sesion
        </button>
      </div>
    </>
  );
};

export default Header;
