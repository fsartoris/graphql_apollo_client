import React from "react";
import Swal from "sweetalert2";

import { gql, useMutation } from "@apollo/client";
import Router from "next/router";

const ELIMINAR_TIPO_RECLADO = gql`
  mutation eliminarTipoReclamo($id: ID!) {
    eliminarTipoReclamo(id: $id)
  }
`;

const GET_TIPO_RECLAMOS = gql`
  query getTipoReclamos {
    getTipoReclamos {
      id
      descripcion
    }
  }
`;

const TipoReclamo = ({ tipo }) => {
  //const [eliminarTipoReclamo] = useMutation(ELIMINAR_TIPO_RECLADO);

  const [eliminarTipoReclamo] = useMutation(ELIMINAR_TIPO_RECLADO, {
    update(cache) {
      const { getTipoReclamos } = cache.readQuery({ query: GET_TIPO_RECLAMOS });
      cache.writeQuery({
        query: GET_TIPO_RECLAMOS,
        data: {
          getTipoReclamos: getTipoReclamos.filter((tipo) => tipo.id !== id),
        },
      });
    },
  });

  const { id, descripcion } = tipo;

  const deleteTipo = (id) => {
    Swal.fire({
      title: "Esta seguro?",
      //text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await eliminarTipoReclamo({
            variables: {
              id: id,
            },
          });

          Swal.fire(
            "Eliminado",
            "",
            //data.eliminarTipoReclamo,
            "success"
          );
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editarTipo = () => {
    Router.push({
      pathname: "/editartipo/[id]",
      query: { id },
    });
  };

  return (
    <tr>
      <td className="border px-4 py-2">{descripcion}</td>
      <td className="border px-4 py-2 flex">
        <button
          className="flex justify-center items-center bg-red-600 py-2 px-4  text-white rounded text-xs uppercase font-bold"
          onClick={() => deleteTipo(id)}
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        <button
          className="flex justify-center items-center bg-green-600 py-2 px-4  text-white rounded text-xs uppercase font-bold ml-2"
          onClick={() => editarTipo(id)}
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            ></path>
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default TipoReclamo;
