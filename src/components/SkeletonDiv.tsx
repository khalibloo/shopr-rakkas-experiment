import { clsx } from "clsx";

import { Skeleton } from "antd";
import { SkeletonButtonProps } from "antd/es/skeleton/Button";

interface Props extends SkeletonButtonProps {
  loading?: boolean;
  children?: React.ReactElement;
}

const SkeletonDiv: React.FC<Props> = ({ children, className, loading, ...rest }) => {
  if (!loading) {
    return <>{children}</>;
  }

  return <Skeleton.Button block className={clsx("h-full", className)} {...rest} />;
};

export default SkeletonDiv;
