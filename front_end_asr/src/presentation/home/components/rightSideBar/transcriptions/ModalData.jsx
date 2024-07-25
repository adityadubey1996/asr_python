import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { getUserMetrics } from "reducers/metric.reducer";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import { grey } from "@mui/material/colors";

export const FilePreview = ({ selectedFile }) => {
  return (
    <>
      <div style={{ flex: 1, padding: "1rem" }}>
        <h1 className="text-gray-200 p-3 font-normal text-xl">Preview</h1>
        <div>
          {selectedFile && (
            <ReactPlayer
              className="react-player"
              url={URL.createObjectURL(selectedFile)}
              width="100%"
              height="100%"
              controls={true}
            />
          )}
        </div>
      </div>
    </>
  );
};

export const Metrics = () => {
  const dispatch = useDispatch();
  const [userMetrics, setUserMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  const metrics = useSelector((state) => state.metrics.userMetrics);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await dispatch(getUserMetrics());
        if (result.payload && result.payload.length > 0) {
          const userMetric = result.payload[0];
          setUserMetrics(JSON.parse(userMetric.customSettings));
        } else {
          console.error("Error fetching user metrics: No data found");
        }
      } catch (error) {
        console.error("Error fetching user metrics:", error);
      } finally {
        setLoading(false);
      }
    }
    if (metrics) {
      setUserMetrics(JSON.parse(metrics[0].customSettings));
      setLoading(false);
    } else {
      fetchData();
    }
  }, [dispatch]);

  return (
    <div className="p-2">
      {loading ? (
        <div className="flex justify-center">
          <CircularProgress sx={{ color: grey[300] }} />
        </div>
      ) : (
        <>
          <h1 className="m-3 text-gray-200 font-semibold text-2xl">Workflow</h1>
          <Grid container spacing={2}>
            {userMetrics.map((metric, index) => (
              <Grid item sm={6} key={index}>
                <Card
                  sx={{
                    backgroundColor: "#39424E",
                    transition: "transform 0.2s ease-in-out",
                    borderRadius: "16px",
                    "&:hover": {
                      transform: "scale(1.02)",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body2"
                      sx={{ color: "#FFC107", fontWeight: "bold" }}
                    >
                      {index + 1}: {metric.question}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#FFFFFF", mt: 1 }}
                    >
                      Answer: {metric.answerSelected} <br />
                      {metric.textInfoTyped && (
                        <Typography
                          variant="body2"
                          sx={{ color: "#FFFFFF", mt: 1 }}
                        >
                          Text Info Typed:{" "}
                          {metric.textInfoTyped.length > 20
                            ? metric.textInfoTyped.substring(0, 40) + "..."
                            : metric.textInfoTyped}
                        </Typography>
                      )}{" "}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};
