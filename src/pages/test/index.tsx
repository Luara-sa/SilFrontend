import React, { useEffect } from "react";
import { useRouter } from "next/router";

import { TestPage } from "modules";

const PlacementTest = () => {
  const router = useRouter();

  useEffect(() => {
    // If this is a placement test request, redirect to the new placement tests page
    if (router.query.isPlacement === "1") {
      router.replace("/placement-tests");
    }
  }, [router.query, router]);

  // If it's a placement test, don't render anything (redirecting)
  if (router.query.isPlacement === "1") {
    return null;
  }

  return (
    <>
      <TestPage />
    </>
  );
};

export default PlacementTest;
