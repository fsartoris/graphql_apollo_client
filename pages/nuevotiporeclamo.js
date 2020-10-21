import React, { useState } from "react";
import Layout from "../components/Layout";

import { useFormik } from "formik";
import * as Yup from "Yup";

import { useMutation, gql } from "@apollo/client";

import { useRouter } from "next/router";

const CREATE_TIPO_RECLAMO = gql`
  mutation nuevoTipoReclamo($input: TipoReclamoInput) {
    nuevoTipoReclamo(input: $input) {
      id
    }
  }
`;

/*
const GET_RECLAMOS_USER = gql`
  query getReclamosUsuario {
    getReclamosUsuario {
      id
      detalle
      tipo
      usuario
    }
  }`
*/

const NuevoTipoReclamo = () => {
  /*
    const [ nuevoReclamo ] = useMutation(CREATE_RECLAMO, { 
        update(cache, { data: { nuevoReclamo }}){
            const { getReclamosUsuario } = cache.readQuery({ query: GET_RECLAMOS_USER})
            cache.writeQuery({
                query: GET_RECLAMOS_USER,
                data: {
                    getReclamosUsuario: [...getReclamosUsuario, nuevoReclamo]
                }                
            })
        }
    });
    */

  const [nuevoTipoReclamo] = useMutation(CREATE_TIPO_RECLAMO);

  const router = useRouter();

  const [message, saveMessage] = useState(null);

  const formik = useFormik({
    initialValues: {
      descripcion: "",
    },
    validationSchema: Yup.object({
      descripcion: Yup.string().required("Campo Requerido"),
    }),
    onSubmit: async (values) => {
      const { descripcion } = values;

      try {
        const { data } = await nuevoTipoReclamo({
          variables: {
            input: {
              descripcion,
            },
          },
        });

        router.push("/tiporeclamos");
      } catch (error) {
        saveMessage(error.message.replace("GraphQL error: ", ""));
        setTimeout(() => {
          saveMessage(null);
        }, 3000);
      }
    },
  });

  const showMessage = () => {
    return (
      <div className="py-2 px-3 w-full my-3 max-w-sm text-center mx-auto text-red-700">
        <p>{message}</p>
      </div>
    );
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-900 font-light">
        Nuevo Tipo de Reclamo
      </h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="descripcion"
              >
                Descripcion
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="descripcion"
                type="text"
                placeholder="Descripcion del Tipo"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></input>
            </div>

            {formik.touched.descripcion && formik.errors.descripcion ? (
              <div className="my-2 text-red-700 p-1">
                <p>{formik.errors.descripcion}</p>
              </div>
            ) : null}

            {message && showMessage()}

            <input
              type="submit"
              className="bg-green-600 w-full mt-5 p-2 text-white uppercase hover:bg-green-900"
              value="Guardar Tipo de Reclamo"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoTipoReclamo;
