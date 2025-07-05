import { Box } from "@mui/material";
import { convertStringToJSON } from "helper/convertStringToJSON";
import { dateToString } from "helper/dateToString";
import { useMe } from "hooks/useMe";
import { MyOrdersCard } from "modules/profile/components";
import React, { useEffect } from "react";
import { _WithAuthService } from "services/withAuth.service";
import { profileStore } from "store/profileStore";

export const MyOrdersTab = () => {
  const { info_system } = useMe();

  const [setData, myData] = profileStore((state) => [
    state.setData,
    state.myData,
  ]);

  useEffect(() => {
    if (myData?.orders) return;
    _WithAuthService
      .getDocumentsByToken()
      .then((res) => setData(res.result.data.data, "orders"))
      .catch((err) => console.log(err));

    return () => {};
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: { xs: "center", md: "start" },
      }}
    >
      {myData?.orders &&
        myData?.orders.map((order, index: any) => (
          <Box sx={{ flex: 0.5 }} key={order.id}>
            <MyOrdersCard
              orderType={info_system?.document_type_enum[
                Object.keys(info_system?.document_type_enum)[order.type - 1]
              ]
                .split("_")
                .join(" ")}
              courseName={convertStringToJSON(order.content_array).course_name}
              date={dateToString(order.created_at)}
            />
          </Box>
        ))}
    </Box>
  );
};
