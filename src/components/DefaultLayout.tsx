import Head from "next/head";
import { ReactNode } from "react";
import { ReactQueryDevtools } from "react-query/devtools";
import { Navigation } from "./Navigation";

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Head>
        <title>Hidash - CRUD Example using tRPC, Prisma ORM, React Query, Next.js and Tailwind CSS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="bg-gray-200 pb-20 font-poppins antialiased">
        <div className="container mx-auto flex min-h-screen max-w-4xl flex-col bg-gray-200">
          <Navigation />
          <section className="flex flex-col p-4">{children}</section>
        </div>
      </main>

      {process.env.NODE_ENV !== "production" && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  );
};
