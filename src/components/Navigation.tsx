import { useRouter } from "next/router";
import Link from "next/link";

export const Navigation = () => {
  const router = useRouter();
  const classesActive = "bg-gradient-to-r from-sky-600 to-cyan-500 text-white";
  const classesHover = "hover:bg-gradient-to-r hover:from-cyan-500 hover:to-sky-600 hover:text-white";
  const activeLink = (path: string) => (router.pathname === path ? classesActive : classesHover);
  return (
    <nav className="p-4">
      <h1 className="my-4 text-center text-4xl font-bold">
        <Link href="/">
          <a className="hover:opacity-60">
            Hidash
            <span className="text-teal-600">.</span>
          </a>
        </Link>
      </h1>
      <div className="flex overflow-hidden rounded-lg bg-white">
        <Link href="/">
          <a className={`py-2 px-3 ${activeLink("/")}`}>Customers</a>
        </Link>
        <Link href="/customer/new">
          <a className={`py-2 px-3 ${activeLink("/customer/new")}`}>Add Customer</a>
        </Link>
      </div>
    </nav>
  );
};
