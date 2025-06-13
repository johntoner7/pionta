import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import styles from './CourseHeader.module.scss';

interface CourseHeaderProps {
  courseName: string;
  onCourseNameChange: (name: string) => void;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ courseName, onCourseNameChange }) => (
  <Box className={styles.courseHeader}>
    <Box className={styles.titleContainer}>
      <GolfCourseIcon className={styles.titleIcon} />
      <TextField
        fullWidth
        placeholder="Enter your course name..."
        value={courseName}
        onChange={(e) => onCourseNameChange(e.target.value)}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          className: styles.titleInput,
        }}
        inputProps={{
          className: styles.titleText,
        }}
      />
    </Box>
    <Typography variant="body2" className={styles.titleHelper}>
      Give your pub golf course a memorable name
    </Typography>
  </Box>
); 