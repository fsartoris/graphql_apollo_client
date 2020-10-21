import React, { useState } from "react";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";

const NEW_ACCOUNT = gql`
  mutation nuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input) {
      id
      nombre
      apellido
      email
    }
  }
`;

const New = () => {
  const [message, saveMessage] = useState(null);

  const [newUser] = useMutation(NEW_ACCOUNT);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("Nombre es mandatorio"),
      apellido: Yup.string().required("Apellido es mandatorio"),
      email: Yup.string()
        .email("Email invalido")
        .required("Email es mandatorio"),
      password: Yup.string()
        .required("Password es mandatorio")
        .min(6, "Minimo 6 caracteres"),
    }),
    onSubmit: async (values) => {
      const { nombre, apellido, email, password } = values;

      try {
        const { data } = await newUser({
          variables: {
            input: {
              nombre: nombre,
              apellido: apellido,
              email: email,
              password: password,
            },
          },
        });

        saveMessage(`Se creo el usuario ${data.nuevoUsuario.nombre}`);

        setTimeout(() => {
          saveMessage(null);
          router.push("/login");
        }, 3000);
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
      <div className="py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{message}</p>
      </div>
    );
  };

  return (
    <>
      <Layout>
        <h1 className="text-center text-2xl text-white font-light">Login</h1>
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="nombre"
                >
                  Nombre
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="nombre"
                  type="text"
                  placeholder="Nombre del usuario"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></input>
              </div>
              {formik.touched.nombre && formik.errors.nombre ? (
                <div className="my-2 text-red-700 p-1">
                  <p>{formik.errors.nombre}</p>
                </div>
              ) : null}

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="apellido"
                >
                  Apellido
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="apellido"
                  type="text"
                  placeholder="Apellido del usuario"
                  value={formik.values.apellido}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></input>
              </div>

              {formik.touched.apellido && formik.errors.apellido ? (
                <div className="my-2 text-red-700 p-1">
                  <p>{formik.errors.apellido}</p>
                </div>
              ) : null}

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  placeholder="Email del usuario"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></input>
              </div>

              {formik.touched.email && formik.errors.email ? (
                <div className="my-2 text-red-700 p-1">
                  <p>{formik.errors.email}</p>
                </div>
              ) : null}

              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Password del usuario"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></input>
              </div>

              {formik.touched.password && formik.errors.password ? (
                <div className="my-2 text-red-700 p-1">
                  <p>{formik.errors.password}</p>
                </div>
              ) : null}

              {message && showMessage()}
              <input
                type="submit"
                className="bg-red-800 w-full mt-5 p-2 text-white uppercase hover:bg-red-900"
                value="Crear Cuenta"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default New;
