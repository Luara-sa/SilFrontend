import React, { useEffect } from "react";

import { useMe } from "hooks/useMe";

import { PlacementTestPopup } from "./PlacementTestPopup";
import { PlacementTestPopupShouldBeLogged } from "./PlacementTestPopupShouldBeLogged";

interface Props {
  open: boolean;
  handleClose: () => void;
}

export const PlacementTestConditionalPopup = (props: Props) => {
  const { isThereIsToken, loading } = useMe();

  switch (isThereIsToken && !loading) {
    case true:
      return (
        <PlacementTestPopup handleClose={props.handleClose} open={props.open} />
      );
      break;

    case false:
      return (
        <PlacementTestPopupShouldBeLogged
          handleClose={props.handleClose}
          open={props.open}
        />
      );
      break;

    default:
      return <></>;
      break;
  }
};
