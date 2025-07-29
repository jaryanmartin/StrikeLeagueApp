// import React, { createContext, useState, ReactNode } from 'react';

// export const BleContext = createContext(null);

// type BleProviderProps = {
//   children: ReactNode;
// }

// export const BleProvider = ({ children }: BleProviderProps ) => {
//   const [faceAngle, setFaceAngle] = useState<number | null>(null);
//   const [swingPath, setSwingPath] = useState<number | null>(null);
//   const [sideAngle, setSideAngle] = useState<number | null>(null);
//   const [attackAngle, setAttackAngle] = useState<number | null>(null);

//   return (
//     <BleContext.Provider value={{
//       faceAngle, setFaceAngle,
//       swingPath, setSwingPath,
//       sideAngle, setSideAngle,
//       attackAngle, setAttackAngle
//     }}>
//       {children}
//     </BleContext.Provider>
//   );
// };

// Removed this attempt for global variables and used the zustard library instead. 