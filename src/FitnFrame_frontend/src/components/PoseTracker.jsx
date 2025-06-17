import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { POSE_LANDMARKS } from "@mediapipe/pose";

const PoseTracker = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [repCount, setRepCount] = useState(0);
  const [stage, setStage] = useState(null);

  useEffect(() => {
    const runPoseDetection = async () => {
      // Initialize the pose detector
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        {
          runtime: "mediapipe",
          modelType: "full",
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose",
        }
      );

      // Run pose detection at regular intervals
      setInterval(async () => {
        if (webcamRef.current?.video?.readyState === 4) {
          const video = webcamRef.current.video;
          const poses = await detector.estimatePoses(video);
          if (poses.length > 0) processPose(poses[0]);
        }
      }, 100);
    };

    runPoseDetection();
  }, []);

  const processPose = (pose) => {
    const keypoints = pose.keypoints;

    // Extract joint positions for the left arm
    const shoulder = keypoints[POSE_LANDMARKS.LEFT_HIP];
    const elbow = keypoints[POSE_LANDMARKS.LEFT_SHOULDER];
    const wrist = keypoints[POSE_LANDMARKS.LEFT_ELBOW];

    if (shoulder && elbow && wrist) {
      // Calculate the angle between the shoulder, elbow, and wrist
      const angle = calculateAngle(shoulder, elbow, wrist);
      drawCanvas(pose, angle);

      // Update the stage and rep count based on the angle
      if (angle > 160) setStage("down");
      if (angle < 30 && stage === "down") {
        setStage("up");
        setRepCount((prev) => prev + 1);
      }
    }
  };

  const calculateAngle = (a, b, c) => {
    // Calculate the angle between three points using the atan2 function
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  const drawCanvas = (pose, angle) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw text on the canvas
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Reps: ${repCount}`, 20, 40);
    ctx.fillText(`Stage: ${stage}`, 20, 70);
    ctx.fillText(`Angle: ${Math.round(angle)}°`, 20, 100);
  };

  return (
    <div className="pose-tracker">
      <Webcam ref={webcamRef} style={{ width: 640, height: 480 }} />
      <canvas ref={canvasRef} width={640} height={480} />
    </div>
  );
};

export default PoseTracker;