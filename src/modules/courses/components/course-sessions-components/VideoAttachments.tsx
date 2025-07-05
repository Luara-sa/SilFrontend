import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import videojs from "video.js";
import "video.js/dist/video-js.css";

// import ReactPlayer from "react-player";

// import { Player, ControlBar, ReplayControl } from "video-react";
// import "node_modules/video-react/dist/video-react.scss";

// City
// import '@videojs/themes/dist/city/index.css';

// Fantasy
// import '@videojs/themes/dist/fantasy/index.css';

// Forest
import "@videojs/themes/dist/forest/index.css";
import { useRouter } from "next/router";
import { _StudentRoleService } from "services/studentRole.service";
import { courseStore } from "store/courseStore";

// Sea
// import '@videojs/themes/dist/sea/index.css';

interface Props {
  url: string;
  themeName: "sea" | "fantasy" | "forest" | "city";
}

export const VideoAttachments = (props: Props) => {
  const videoRef = useRef<any>(null);
  const playerRef = useRef<any>(null);

  const router = useRouter();

  const [course, updateAttendence, attachmentSelected, lastAttachmentId] =
    courseStore((state) => [
      state.course,
      state.updateAttendence,
      state.attachmentSelected,
      state.lastAttachmentId,
    ]);

  const [options, setOptions] = useState({
    controls: true,
    sources: [
      {
        src: props.url,
        type: "video/mp4",
      },
    ],
  });

  useEffect(() => {
    const player = playerRef.current;

    if (!player) {
      const videoElemnet = videoRef.current;
      if (!videoElemnet) return;

      playerRef.current = videojs(videoElemnet, options);
    }
    return () => {
      if (player) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [options, videoRef, playerRef]);

  // *******************************
  // To calculate the time the user play the video

  // useEffect(() => {
  //   var timeStarted = -1;
  //   var timePlayed = 0;
  //   var duration = 0;
  //   // If video metadata is laoded get duration
  //   if (videoRef.current.readyState > 0) getDuration.call(videoRef.current);
  //   //If metadata not loaded, use event to get it
  //   else {
  //     videoRef.current.addEventListener("loadedmetadata", getDuration);
  //   }
  //   // remember time user started the video
  //   function videoStartedPlaying() {
  //     timeStarted = new Date().getTime() / 1000;
  //   }
  //   function videoStoppedPlaying(event: any) {
  //     console.log(event);
  //     // Start time less then zero means stop event was fired vidout start event
  //     if (timeStarted > 0) {
  //       var playedFor = new Date().getTime() / 1000 - timeStarted;
  //       timeStarted = -1;
  //       // add the new number of seconds played
  //       timePlayed += playedFor;
  //     }
  //     // document.getElementById("played").innerHTML = Math.round(timePlayed) + "";
  //     // Count as complete only if end of video was reached
  //     if (timePlayed >= duration && event.type == "ended") {
  //       // document.getElementById("status").className = "complete";
  //     }
  //   }

  //   function getDuration() {
  //     duration = videoRef.current.duration;
  //     // document
  //     //   .getElementById("duration")
  //     //   .appendChild(new Text(Math.round(duration) + ""));
  //     console.log("Duration: ", duration);
  //   }

  //   videoRef.current.addEventListener("play", videoStartedPlaying);
  //   videoRef.current.addEventListener("playing", videoStartedPlaying);

  //   videoRef.current.addEventListener("ended", videoStoppedPlaying);
  //   videoRef.current.addEventListener("pause", videoStoppedPlaying);

  //   return () => {};
  // }, []);

  const onVideoEnd = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    if (attachmentSelected?.attended) return;

    const attachmentId = router.query.attachment;
    const sessionId = router.query.session;

    updateAttendence(sessionId as string, attachmentId as string);

    _StudentRoleService
      .updateAttendanceStudent({
        student_order_id: course?.order?.id ?? "",
        session_id: +(sessionId as string) ?? "",
        attchment_id: +(attachmentId as string),
      })
      .then((res) => {
        if (lastAttachmentId && attachmentSelected)
          if (+lastAttachmentId === +attachmentSelected.id)
            _StudentRoleService
              .completedCourse({ student_order_id: 1 })
              .then((res) => console.log(res))
              .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box sx={{ height: "500px" }}>
      <div data-vjs-player>
        <video
          ref={videoRef}
          onEnded={onVideoEnd}
          className={`video-js vjs-big-play-centered vjs-theme-${props.themeName}`}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            backgroundColor: "#EEEEEE",
          }}
        />
      </div>
    </Box>
  );
};
