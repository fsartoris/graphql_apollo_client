import React, { useState } from "react";
import Layout from "../components/Layout";
import { useFormik, yupToFormErrors } from "formik";
import * as Yup from "yup";

import { gql, useMutation } from "@apollo/client";

import { useRouter } from "next/router";

const AUTH_USER = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const [message, saveMessage] = useState(null);

  const [autenticarUsuario] = useMutation(AUTH_USER);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email invalido")
        .required("Email es mandatorio"),
      password: Yup.string()
        .required("Password es mandatorio")
        .min(6, "Minimo 6 caracteres"),
    }),
    onSubmit: async (values) => {
      const { email, password } = values;

      try {
        const { data } = await autenticarUsuario({
          variables: {
            input: {
              email,
              password,
            },
          },
        });

        saveMessage("Todo OK");

        setTimeout(() => {
          const { token } = data.autenticarUsuario;
          localStorage.setItem("token", token);
        }, 1000);

        setTimeout(() => {
          saveMessage(null);
          router.push("/");
        }, 1000);
      } catch (error) {
        console.log(error);
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
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  placeholder="Email del usuario"
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="Password del usuario"
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
                value="Iniciar Sesión"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;
