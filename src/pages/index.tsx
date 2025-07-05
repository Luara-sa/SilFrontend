import React from "react";

import { Seo } from "components/shared";
import { HomeIndex } from "modules/home/pages/HomeIndex";

const Home = () => {
  return (
    <>
      <Seo title="Saudia Institute for Traning" />
      <HomeIndex />
    </>
  );
};

export default Home;

// export const getStaticProps = async (context: any) => {
//   // const paths = await _PathService
//   //   .getPaths({ limit: 10, page: 1 })
//   //   .then((res) => res.result)
//   //   .catch((err) => console.log(err));
//   // const courses = await _CourseService
//   //   .getAll()
//   //   .then((res) => res.result.data)
//   //   .catch((err) => console.log(err));
//   // return {
//   //   props: {
//   //     courses: courses,
//   //     paths: paths,
//   //   },
//   // };
// };
