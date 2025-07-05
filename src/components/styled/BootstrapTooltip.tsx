import { styled, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";

export const BootstrapTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  )
)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#0c8494",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#0c8494",
  },
}));
