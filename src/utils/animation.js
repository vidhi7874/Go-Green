// ===========================================

// motion.js

import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

export const MotionBox = motion(Box);

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideIn = {
  initial: { x: -100 },
  animate: { x: 0 },
  exit: { x: -100 },
};

export const scaleIn = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  exit: { scale: 0 },
};

export const rotateIn = {
  initial: { rotate: -180 },
  animate: { rotate: 0 },
  exit: { rotate: -180 },
};

export const slideUp = {
  initial: { y: 50, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 50, opacity: 0 },
  // transition: {
  //   duration: 0.8, // Adjust the duration as needed
  //   ease: "easeOut", // Use a specific easing function (e.g., "easeOut", "easeInOut")
  //   // Add other transition properties to enhance the animation
  //   // For example:
  //   // delay: 0.1, // Add a delay before the animation starts
  //   // bounce: 0.5, // Add a bounce effect at the end
  //   // damping: 8, // Adjust the damping for spring animations
  //   // stiffness: 150, // Adjust the stiffness for spring animations
  // },
};

// export const slideDown = {
//   initial: { y: -50, opacity: 0 },
//   animate: { y: 0, opacity: 1 },
//   exit: { y: -50, opacity: 0 },
// };

const slideDown = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

export const shake = {
  animate: {
    rotate: [-10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  },
};

export const MotionSlideIn = ({ children }) => (
  <motion.div
    variants={slideIn}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

export const MotionScaleIn = ({ children }) => (
  <motion.div
    variants={scaleIn}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

export const MotionRotateIn = ({ children }) => (
  <motion.div
    variants={rotateIn}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

// export const MotionSlideDown = ({ children }) => (
//   <motion.div
//     variants={slideDown}
//     initial="initial"
//     animate="animate"
//     exit="exit"
//   >
//     {children}
//   </motion.div>
// );

export const MotionSlideDown = ({ children }) => (
  <motion.div
    variants={slideDown}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.5 }} // Adjust the duration as needed
  >
    {children}
  </motion.div>
);

export const MotionShake = ({ children }) => (
  <motion.div variants={shake} animate="animate">
    {children}
  </motion.div>
);

export const MotionFadeIn = ({ duration = 0.3, delay = 0, children }) => (
  <MotionBox
    variants={fadeIn}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration, delay }}
  >
    {children}
  </MotionBox>
);

export const MotionSlideUp = ({ duration, delay, children }) => (
  <MotionBox
    variants={slideUp}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration, delay }}
  >
    {children}
  </MotionBox>
);

// export const slideUp = {
//   initial: { y: 50, opacity: 0 },
//   animate: { y: 0, opacity: 1 },
//   exit: { y: 50, opacity: 0 },
//   transition: {
//     duration: 0.3, // Adjust the duration as needed
//     ease: "easeOut", // Use a specific easing function (e.g., "easeOut", "easeInOut")
//     // Add other transition properties to enhance the animation
//     // For example:
//     // delay: 0.1, // Add a delay before the animation starts
//     // bounce: 0.5, // Add a bounce effect at the end
//     // damping: 8, // Adjust the damping for spring animations
//     // stiffness: 150, // Adjust the stiffness for spring animations
//   },
// };
