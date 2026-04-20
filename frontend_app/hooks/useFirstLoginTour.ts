// import { useState, useEffect } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const VISIT_COUNT_KEY = 'visit_count';

// export const useFirstLoginTour = () => {
//   const [showTour, setShowTour] = useState(false);
//   const [isChecking, setIsChecking] = useState(true);

//   useEffect(() => {
//     const checkFirstVisit = async () => {
//       try {
//         const visitCount = await AsyncStorage.getItem(VISIT_COUNT_KEY);
//         console.log('Visit count:', visitCount);

//         if (visitCount === null || visitCount === '0') {
//           setShowTour(true);
//         }
//       } catch (error) {
//         console.error('Error checking visit count:', error);
//       } finally {
//         setIsChecking(false);
//       }
//     };

//     checkFirstVisit();
//   }, []);

//   const completeTour = async () => {
//     await AsyncStorage.setItem(VISIT_COUNT_KEY, '1');
//     setShowTour(false);
//   };

//   const skipTour = async () => {
//     await AsyncStorage.setItem(VISIT_COUNT_KEY, '1');
//     setShowTour(false);
//   };

//   return { showTour, completeTour, skipTour, isChecking };
// };


import { useState } from 'react';

export const useFirstLoginTour = () => {
  const [showTour, setShowTour] = useState(false);

  const completeTour = () => setShowTour(false);
  const skipTour = () => setShowTour(false);

  return { showTour, completeTour, skipTour, isChecking: false };
};