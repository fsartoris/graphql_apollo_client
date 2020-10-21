import Head from "next/head";
import Layout from "../components/Layout";
import { gql, useQuery } from "@apollo/client";
import Link from "next/link";

const GET_RECLAMOS_USER = gql`
  query getReclamosUsuario {
    getReclamosUsuario {
      id
      detalle
      tipo {
        descripcion
      }
      usuario
    }
  }
`;

const Index = () => {
  const { data, loading, error } = useQuery(GET_RECLAMOS_USER);

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-900 font-light">Reclamos</h1>
        <Link href="/nuevoreclamo">
          <a className="bg-green-700 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-green-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
            Nuevo Reclamo
          </a>
        </Link>
        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-black">
              <tr className="text-white">
                <th className="w-1/5 py-2">Detalle</th>
                <th className="w-1/5 py-2">Tipo</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading === false &&
                data.getReclamosUsuario.map((row) => (
                  <tr key={row.id}>
                    <td className="border px-4 py-2">{row.detalle}</td>
                    <td className="border px-4 py-2">{row.tipo.descripcion}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
};

export default Index;
