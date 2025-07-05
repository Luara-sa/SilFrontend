import { Box, Button, Skeleton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export const CourseCardLoader = () => {
  return (
    <>
      <Skeleton
        variant="rectangular"
        width={320}
        height={450}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "10px",
          fontSize: "12px",
          fontWeight: "400",
          color: "#1E5B63",
        }}
      >
        <>
          <Box>
            <CircularProgress
              color="secondary"
              sx={{ width: "50px", height: "50px", visibility: "visible" }}
            />
          </Box>
          Loading ...
        </>
      </Skeleton>
    </>
  );
};
