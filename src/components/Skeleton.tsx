import React from "react";

interface SkeletonProps {
  height?: string | number;
  width?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ height = "20px", width = "100%" }) => (
  <div
    style={{ height, width }}
    className="bg-gray-200 animate-pulse rounded"
    aria-busy="true"
  />
);

export default Skeleton;
