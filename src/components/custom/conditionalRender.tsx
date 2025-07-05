import React, { useMemo, useCallback, FC, PropsWithChildren } from "react";

interface CaseProps {
  condition: boolean | any;
}

const Case: FC<PropsWithChildren<CaseProps>> = ({ condition, children }) => {
  return condition ? <>{children}</> : null;
};

interface Props {
  condition: boolean | (() => boolean) | any;
  children?: React.ReactNode;
  default?: React.ReactElement | null;
  debug?: boolean;
}

const ConditionalRender = (props: Props) => {
  const { debug } = props;
  if (debug) {
    console.log(
      `ConditionalRender: ${props.condition ? "matched" : "unmatched"}`
    );
  }

  const childrenArray = useMemo(
    () => React.Children.toArray(props.children),
    [props.children]
  );

  // if (!childrenArray.length) {
  //   console.warn("ConditionalRender: no children found");
  //   return null;
  // }

  const matchedChild = useMemo(
    () =>
      !childrenArray.length
        ? false
        : childrenArray.filter(
            (child) => (child as any).props.condition === props.condition
          ),
    [childrenArray]
  );

  if (matchedChild) {
    return <>{matchedChild[0]}</>;
  }
  return <>{props.default}</> || null;
};

export { Case };
export default ConditionalRender;

// import React, { useMemo, useCallback } from "react";

// interface CaseProps {
//   condition: boolean | (() => boolean);
//   children: React.ReactNode;
// }

// const Case = ({ condition, children }: CaseProps) => {
//   return children;
// };

// interface Props {
//   condition: boolean | (() => boolean);
//   children?: React.ReactNode;
//   default?: React.ReactElement | null;
//   debug?: boolean;
// }

// const ConditionalRender = (props: Props) => {
//   const { debug } = props;
//   if (debug) {
//     console.log(
//       `ConditionalRender: ${props.condition ? "matched" : "unmatched"}`
//     );
//   }

//   const childrenArray = useMemo(
//     () => React.Children.toArray(props.children),
//     [props.children]
//   );
//   if (!childrenArray.length) {
//     console.warn("ConditionalRender: no children found");
//     return null;
//   }

//   const matchedChild = useCallback(
//     () => childrenArray.find((child) => (child as any).props.condition),
//     [childrenArray]
//   );
//   if (matchedChild) {
//     return React.Children.only(matchedChild);
//   }
//   return props.default || null;
// };

// export { Case };
// export default ConditionalRender;
