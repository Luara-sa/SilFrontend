import { Typography, Box } from "@mui/material";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import React from "react";
import { SessionCard } from "./SessionCard";
import { Session } from "interface/common";
import { HtmlRenderer } from "components/shared";

interface Props {
  sessions: Session[];
}

export const CurriculumTab = (props: Props) => {
  return (
    <Box>
      <Box>
        <VerticalTimeline layout="1-column-left" lineColor="#DDDDDD">
          {props.sessions.map((session, index) => (
            <VerticalTimelineElement
              key={session.id}
              iconStyle={{
                background: "#EEEEEE",
                border: "1px solid #DDDDDD",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888888",
                boxShadow: "none",
              }}
              icon={<Typography>{index + 1}</Typography>}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: "21px !important",
                    fontWeight: "700 !important",
                    color: "#000000",
                  }}
                >
                  {session.name.en}
                </Typography>

                <HtmlRenderer
                  content={session.description.en}
                  sx={{
                    color: "gray.50",
                    "& p": {
                      fontWeight: "400 !important",
                      fontSize: "12px !important",
                    },
                  }}
                />
              </Box>
              <Box sx={{ mt: "20px" }}>
                {session.attachments && (
                  <SessionCard attachments={session.attachments} />
                )}
              </Box>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </Box>
    </Box>
  );
};
