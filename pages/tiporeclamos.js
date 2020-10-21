import Head from "next/head";
import Layout from "../components/Layout";
import TipoReclamo from "../components/TipoReclamo";

import { gql, useQuery } from "@apollo/client";
import Link from "next/link";

const GET_TIPO_RECLAMOS = gql`
  query getTipoReclamos {
    getTipoReclamos {
      id
      descripcion
    }
  }
`;

const TipoReclamos = () => {
  const { data, loading, error } = useQuery(GET_TIPO_RECLAMOS);

  if (loading) return null;

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-900 font-light">Tipos de Reclamos</h1>
        <Link href="/nuevotiporeclamo">
          <a className="bg-green-700 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-green-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
            Crear Tipo de Reclamo
          </a>
        </Link>
        <table className="table-auto shadow-md mt-5 w-full w-lg">
          <thead className="bg-black">
            <tr className="text-white">
              <th className="w-1/3 py-2">Descripcion</th>
              <th className="w-1/3 py-2">Administrar</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading === false &&
              data.getTipoReclamos.map((row) => (
                <TipoReclamo key={row.id} tipo={row} />
              ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
};

export default TipoReclamos;
