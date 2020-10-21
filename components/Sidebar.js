import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  const router = useRouter();

  return (
    <aside className="bg-black sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5">
      <div>
        <p className="text-white text-xl font-black">Menú</p>
      </div>
      <nav className="mt-5 list-none">
        <li className={router.pathname === "/" ? "bg-gray-900 p-2" : "p-2"}>
          <Link href="/">
            <a className="text-white mb-2 block">Reclamos</a>
          </Link>
        </li>
        <li
          className={
            router.pathname === "/tiporeclamos" ? "bg-gray-900 p-2" : "p-2"
          }
        >
          <Link href="/tiporeclamos">
            <a className="text-white mb-2 block">Tipo de Reclamos</a>
          </Link>
        </li>
      </nav>
    </aside>
  );
};

export default Sidebar;
