import * as React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

interface UploadProgresBarProps {
  percentage: number;
}

export function UploadProgressBar({ percentage }: UploadProgresBarProps) {
  return (
    <div
      style={{
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%)`,
      }}
      className="w-50 position-fixed d-flex flex-column justify-content-evenly align-items-stretch text-center"
    >
      <p>
        {percentage === 100 ? "Processing" : "Uploading"} videos: please don't
        leave this page - this may take up to a couple of minutes depending on
        the size and number of videos being uploaded
      </p>
      <ProgressBar
        variant="success"
        animated
        label={percentage >= 10 ? percentage + "%" : undefined}
        now={percentage}
      />
    </div>
  );
}
