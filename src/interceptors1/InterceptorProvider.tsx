import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { eventEmitter } from "services/eventEmitter";
import "./http-response.interceptor";
import "./http-request.interceptor";
import { meStore } from "store/meStore";
import AlertMessage from "components/custom/AlertMessage";

export const InterceptorProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const setMe = meStore((state) => state.setMe);

  useEffect(() => {
    // this function will take string
    eventEmitter.addListener("router", router.push);

    //this function will take ME | undifind
    eventEmitter.addListener("setMe", setMe);

    //this function will take Snackbar args
    // eventEmitter.addListener("enqueueSnackbar", enqueueSnackbar);

    eventEmitter.addListener("enqueueSnackbar", (event) => {
      // console.log(event);
      enqueueSnackbar(event.message, {
        autoHideDuration: event.autoHideDuration ?? 3000,
        preventDuplicate: event.preventDuplicate ?? true,
        content: (key, message) => (
          <AlertMessage
            id={key}
            message={event.message}
            variants={event.variant}
          />
        ),
      });
    });

    return () => {
      eventEmitter.removeAllListeners("router");
      eventEmitter.removeAllListeners("setMe");
      eventEmitter.removeAllListeners("enqueueSnackbar");
    };
  }, []);

  return children;
};
