import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { useQuery, gql, useMutation } from "@apollo/client";

import Swal from "sweetalert2";

import { Formik, swap } from "formik";
import * as Yup from "yup";

const GET_TIPO_RECLAMO = gql`
  query getTipoReclamo($id: ID!) {
    getTipoReclamo(id: $id) {
      id
      descripcion
    }
  }
`;

const UPDATE_TIPO_RECLAMO = gql`
  mutation actualizarTipoReclamo($id: ID!, $input: TipoReclamoInput) {
    actualizarTipoReclamo(id: $id, input: $input) {
      descripcion
    }
  }
`;

const EditarTipoReclamo = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

  const { data, loading, error } = useQuery(GET_TIPO_RECLAMO, {
    variables: {
      id,
    },
  });

  const [actualizarTipoReclamo] = useMutation(UPDATE_TIPO_RECLAMO);

  const schemaValidation = Yup.object({
    descripcion: Yup.string().required("Campo Requerido"),
  });

  if (loading) return null;

  const updatearData = async (values) => {
    const { descripcion } = values;

    try {
      const { data } = await actualizarTipoReclamo({
        variables: {
          id,
          input: {
            descripcion,
          },
        },
      });

      Swal.fire(
        "Actualizado",
        "El tipo de reclamo se actualizo correctamente",
        "success"
      );

      router.push("/tiporeclamos");
    } catch (error) {
      console.log(error);
    }
  };

  const { getTipoReclamo } = data;

  return (
    <Layout>
      <h1 className="text-2xl text-gray-900 font-light">
        Editar Tipo de Reclamo
      </h1>

      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            validationSchema={schemaValidation}
            enableReinitialize
            initialValues={getTipoReclamo}
            onSubmit={(values, funciones) => {
              updatearData(values);
            }}
          >
            {(props) => {
              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
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
                      value={props.values.descripcion}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    ></input>
                  </div>

                  {props.touched.descripcion && props.errors.descripcion ? (
                    <div className="my-2 text-red-700 p-1">
                      <p>{props.errors.descripcion}</p>
                    </div>
                  ) : null}

                  <input
                    type="submit"
                    className="bg-green-600 w-full mt-5 p-2 text-white uppercase hover:bg-green-900"
                    value="Editar Tipo de Reclamo"
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditarTipoReclamo;
