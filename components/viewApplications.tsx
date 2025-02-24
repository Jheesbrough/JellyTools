"use client";
import React, { useState, useRef } from 'react';
import { Paper, Modal, Typography, Fade } from '@mui/material';
import Grid from "@mui/material/Grid2";
import MovieLeaderboard from "@/components/applications/movieLeaderboard";
import MovieFileSize from "@/components/applications/movieFileSize";
import SeriesFileSize from "@/components/applications/seriesFileSize";

interface ModalStyle {
  top: number;
  left: number;
  width: number;
  height: number;
}

const ViewApplications = () => {
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
  const [modalStyle, setModalStyle] = useState<ModalStyle>({ top: 0, left: 0, width: 0, height: 0 });
  const [initialModalStyle, setInitialModalStyle] = useState<ModalStyle>({ top: 0, left: 0, width: 0, height: 0 });
  const paperRefs = useRef<(HTMLDivElement | null)[]>([]);

  const animateModalSize = (startStyle: ModalStyle, endStyle: ModalStyle, duration: number, callback?: () => void) => {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const newStyle: ModalStyle = {
        top: startStyle.top + (endStyle.top - startStyle.top) * progress,
        left: startStyle.left + (endStyle.left - startStyle.left) * progress,
        width: startStyle.width + (endStyle.width - startStyle.width) * progress,
        height: startStyle.height + (endStyle.height - startStyle.height) * progress,
      };

      setModalStyle(newStyle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (callback) {
        callback();
      }
    };

    requestAnimationFrame(animate);
  };

  const handleOpen = (content: React.ReactNode, index: number) => {
    const paperElement = paperRefs.current[index];
    if (!paperElement) return;
    const rect = paperElement.getBoundingClientRect();
    const startStyle: ModalStyle = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
    const endStyle: ModalStyle = {
      top: window.innerHeight * 0.1,
      left: window.innerWidth * 0.1,
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.8,
    };

    setModalContent(content);
    setInitialModalStyle(startStyle);
    setOpen(true);
    animateModalSize(startStyle, endStyle, 300);
  };

  const handleClose = () => {
    animateModalSize(modalStyle, initialModalStyle, 300, () => setOpen(false));
  };

  const applications = [
    {
      title: "Movie Leaderboard",
      description: "A list of top-rated movies based on user ratings.",
      content: <MovieLeaderboard />
    },
    {
      title: "Movie File Size",
      description: "A list of movies and their file sizes.",
      content: <MovieFileSize />
    },
    {
      title: "Series File Size",
      description: "A list of series and their file sizes.",
      content: <SeriesFileSize />
    }
  ];

  const squares = applications.map((application, index) => (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
      <Paper
        ref={el => { paperRefs.current[index] = el; }}
        style={{ height: 250, padding: 16, cursor: 'pointer' }}
        onClick={() => handleOpen(application.content, index)}
      >
        <Typography variant="h6">{application.title}</Typography>
        <Typography variant="body1">{application.description}</Typography>
      </Paper>
    </Grid>
  ));

  return (
    <>
      <Grid container spacing={2}>
        {squares}
      </Grid>
      <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Fade in={open}>
          <Paper
            className={open ? 'modal-box open' : 'modal-box'}
            sx={{
              top: modalStyle.top,
              left: modalStyle.left,
              width: modalStyle.width,
              height: modalStyle.height,
              position: 'absolute',
              outline: 'none',
              padding: 4,
              overflow: 'hidden',
            }}
          >
            {modalContent}
          </Paper>
        </Fade>
      </Modal>
    </>
  );
};

export default ViewApplications;