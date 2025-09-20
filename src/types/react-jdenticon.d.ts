declare module "react-jdenticon" {
  import * as React from "react";

  interface JdenticonProps {
    value: string;
    size?: number;
    className?: string;
  }

  const Jdenticon: React.FC<JdenticonProps>;
  export default Jdenticon;
}
