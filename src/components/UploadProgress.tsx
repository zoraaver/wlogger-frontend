import * as React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Prompt } from "react-router";

interface UploadProgressProps {
  progress: { [filename: string]: number };
}

export function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div
      style={{
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%)`,
      }}
      className="w-50 position-fixed d-flex flex-column justify-content-evenly align-items-stretch text-center"
    >
      <h6>
        Uploading form videos: this may take several minutes depending on the
        number and size of videos
      </h6>
      {Object.entries(progress).map(([fileName, percentage]) => {
        // remove trailing index at end of name (used to distinguish the same file being uploaded multiple times)
        const abridgedName: string = fileName.slice(0, fileName.length - 1);
        return (
          <React.Fragment key={fileName}>
            <ProgressBar
              variant="success"
              animated
              label={percentage >= 10 ? percentage + "%" : undefined}
              now={percentage}
            />
            <p>{abridgedName}</p>
          </React.Fragment>
        );
      })}
      <Prompt message="Upload in progress - please wait till all file uploads are complete" />
    </div>
  );
}
