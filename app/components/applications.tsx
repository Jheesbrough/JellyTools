"use client";
import React, { useState, useRef } from 'react';
import { Paper, Modal, Box, Typography, Fade } from '@mui/material';
import Grid from "@mui/material/Grid2";
import MovieLeaderboard from "./applications/movieLeaderboard";

const Applications = () => {
    const [open, setOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', description: '' });
    const [modalStyle, setModalStyle] = useState({});
    const paperRefs = useRef([]);

    const animateModalSize = (startStyle, endStyle, duration) => {
        const startTime = performance.now();
        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);

            const newStyle = {
                top: startStyle.top + (endStyle.top - startStyle.top) * progress,
                left: startStyle.left + (endStyle.left - startStyle.left) * progress,
                width: startStyle.width + (endStyle.width - startStyle.width) * progress,
                height: startStyle.height + (endStyle.height - startStyle.height) * progress,
            };

            setModalStyle(newStyle);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    };

    const handleOpen = (title: string, description: string, index: number) => {
        const paperElement = paperRefs.current[index];
        const rect = paperElement.getBoundingClientRect();
        const startStyle = {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        };
        const endStyle = {
            top: window.innerHeight * 0.1,
            left: window.innerWidth * 0.1,
            width: window.innerWidth * 0.8,
            height: window.innerHeight * 0.8,
        };

        setModalContent({ title, description });
        setOpen(true);
        animateModalSize(startStyle, endStyle, 500);
    };

    const handleClose = () => setOpen(false);

    const squares = Array.from({ length: 24 }, (_, index) => {
        const { title, description } = new MovieLeaderboard().getInfo();
        return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Paper
                    ref={el => paperRefs.current[index] = el}
                    style={{ height: 250, padding: 16, cursor: 'pointer' }}
                    onClick={() => handleOpen(title, description, index)}
                >
                    <Typography variant="h6">{title}</Typography>
                    <Typography variant="body1">{description}</Typography>
                </Paper>
            </Grid>
        );
    });

    return (
        <>
            <Grid container spacing={2}>
                {squares}
            </Grid>
            <Modal open={open} onClose={handleClose} closeAfterTransition>
                <Fade in={open}>
                    <Box
                        className={open ? 'modal-box open' : 'modal-box'}
                        sx={{
                            top: modalStyle.top,
                            left: modalStyle.left,
                            width: modalStyle.width,
                            height: modalStyle.height,
                            bgcolor: 'background.paper',
                            position: 'absolute',
                        }}
                    >
                        <Typography variant="h4">{modalContent.title}</Typography>
                        <Typography variant="body1">{modalContent.description}</Typography>
                    </Box>
                </Fade>
            </Modal>
        </>
    );
};

export default Applications;