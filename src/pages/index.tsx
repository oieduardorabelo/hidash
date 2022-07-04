import { NextPageWithLayout } from "~/pages/_app";

const IndexPage: NextPageWithLayout = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl">
        Welcome to Hidash<span className="text-teal-600">.</span>
      </h1>
      <span>🚀 You can explore using the above options</span>
    </div>
  );
};

export default IndexPage;
