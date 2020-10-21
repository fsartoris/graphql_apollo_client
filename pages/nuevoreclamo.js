import React from "react";
import Layout from "../components/Layout";

import { useFormik } from "formik";
import * as Yup from "Yup";

import { useMutation, useQuery, gql } from "@apollo/client";

import { useRouter } from "next/router";

const CREATE_RECLAMO = gql`
  mutation nuevoReclamo($input: ReclamoInput) {
    nuevoReclamo(input: $input) {
      id
    }
  }
`;

const GET_RECLAMOS_USER = gql`
  query getReclamosUsuario {
    getReclamosUsuario {
      id
      detalle
      tipo
      usuario
    }
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

const NuevoReclamo = () => {
  const { data, loading, error } = useQuery(GET_TIPO_RECLAMOS);

  const [nuevoReclamo] = useMutation(CREATE_RECLAMO, {
    update(cache, { data: { nuevoReclamo } }) {
      const { getReclamosUsuario } = cache.readQuery({
        query: GET_RECLAMOS_USER,
      });
      cache.writeQuery({
        query: GET_RECLAMOS_USER,
        data: {
          getReclamosUsuario: [...getReclamosUsuario, nuevoReclamo],
        },
      });
    },
  });

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      detalle: "",
    },
    validationSchema: Yup.object({
      detalle: Yup.string().required("Detalle requerido"),
      categoria: Yup.string().required("Categoria requerida"),
    }),
    onSubmit: async (values) => {
      const { detalle, categoria } = values;

      try {
        const { data } = await nuevoReclamo({
          variables: {
            input: {
              detalle,
              tipo: categoria,
            },
          },
        });

        router.push("/");
      } catch (error) {
        console.log("error => ", error);
      }
    },
  });

  return (
    <Layout>
      <h1 className="text-2xl text-gray-900 font-light">Nuevo Reclamo</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="categoria"
              >
                Categoria
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="categoria"
                value={formik.values.categoria}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" label="Seleccione" />
                {loading === false &&
                  data.getTipoReclamos.map((row) => (
                    <option value={row.id} label={row.descripcion} />
                  ))}
              </select>

              {formik.touched.categoria && formik.errors.categoria ? (
                <div className="my-2 text-red-700 p-1">
                  <p>{formik.errors.categoria}</p>
                </div>
              ) : null}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="detalle"
              >
                Detalle
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="detalle"
                type="text"
                placeholder="Detalle"
                value={formik.values.detalle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></input>
            </div>

            {formik.touched.detalle && formik.errors.detalle ? (
              <div className="my-2 text-red-700 p-1">
                <p>{formik.errors.detalle}</p>
              </div>
            ) : null}

            <input
              type="submit"
              className="bg-red-800 w-full mt-5 p-2 text-white uppercase hover:bg-red-900"
              value="Registrar Reclamo"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoReclamo;
