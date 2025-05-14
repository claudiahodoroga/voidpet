// src/components/ComputerShell/ComputerShell.tsx
import React from "react";

// Props for the TopBar component
interface TopBarProps {
  petName?: string;
  showTitle?: boolean; // To control if "Voidpet - PetName" is shown
}

// Component for the top bar inside the screen
export const TopBar: React.FC<TopBarProps> = ({
  petName,
  showTitle = true,
}) => {
  return (
    <div className="bg-gray-800/60 backdrop-blur-sm text-gray-300 px-3 sm:px-4 py-2 flex items-center justify-between border-b-2 border-gray-900/50 shadow-md">
      <div className="flex items-center space-x-2">
        {/* Egg Icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-void-blue-medium"
        >
          <path d="M12 2.25c-5.162 0-9.755 3.09-11.482 7.5H1.22a.75.75 0 00-.748.8V12a.75.75 0 00.343.642S2.076 13.5 3.06 13.5H3.6c.094.613.296 1.207.595 1.772.915 1.725 2.753 3.028 5.096 3.728C9.839 19.091 12 21.75 12 21.75s2.161-2.659 2.709-2.75c2.343-.699 4.181-2.003 5.096-3.728.299-.565.501-1.159.595-1.772h.541c.982 0 1.224-.608 1.224-.608A.75.75 0 0022.8 12v-.75a.75.75 0 00-.748-.8h-1.273C19.028 5.34 14.437 2.25 12 2.25zM12 3.75a7.713 7.713 0 015.955 2.897L12 12.384l-5.955-5.737A7.713 7.713 0 0112 3.75zM4.514 10.5c.64-.804 1.343-1.518 2.086-2.13l5.4 5.207-5.4 5.207c-.743-.612-1.446-1.326-2.086-2.13v-6.154zm14.972 0v6.154c-.64.804-1.343 1.518 2.086 2.13l-5.4-5.207 5.4-5.207c.743.612 1.446 1.326 2.086 2.13z" />
        </svg>
        {showTitle && (
          <span className="font-semibold text-sm sm:text-base">
            {petName ? `Voidpet - ${petName}` : "Voidpet"}
          </span>
        )}
      </div>
      {/* Status light */}
      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500/80 rounded-full shadow-md border border-green-600 animate-pulse"></div>
    </div>
  );
};

// Props for the ComputerShell component
interface ComputerShellProps {
  children: React.ReactNode; // Content to display on the screen
  showTopBarTitle?: boolean; // To control title visibility in TopBar
  petName?: string; // Optional pet name for the TopBar
  // We'll add props for stats and controls later
}

const ComputerShell: React.FC<ComputerShellProps> = ({
  children,
  showTopBarTitle = true,
  petName,
}) => {
  return (
    // Outermost div for the physical terminal casing with 3D effect
    <div className="bg-gradient-to-br from-gray-400 via-gray-300 to-gray-400 p-2 sm:p-3 md:p-4 rounded-3xl shadow-2xl border-t-2 border-l-2 border-gray-500/70 border-b-8 border-r-8 border-b-gray-600/70 border-r-gray-600/70 transform perspective-1000 rotate-x-1 rotate-y-0">
      {/* Main Computer Structure (Screen + Side Panel Area) */}
      <div
        className="w-full max-w-4xl xl:max-w-5xl flex rounded-xl shadow-xl overflow-hidden"
        style={{ height: "650px", maxHeight: "80vh" }}
      >
        {/* Screen Area with multiple bezels for depth */}
        <div className="flex-grow flex flex-col bg-void-dark p-1.5 sm:p-2 rounded-l-xl border-t-2 border-l-2 border-gray-500/50 border-b-4 border-r-4 border-b-gray-800/80 border-r-gray-800/80">
          {/* Inner Screen Frame - the actual "glass" area */}
          <div className="flex-grow bg-black rounded-md shadow-inner overflow-hidden flex flex-col border-2 border-gray-700/60">
            <TopBar petName={petName} showTitle={showTopBarTitle} />

            {/* Main Content Area where children (form or pet view) will be rendered */}
            <div className="flex-grow bg-screen-gradient p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-y-auto">
              {children}
            </div>

            {/* Placeholder for Bottom Stats Bar - to be added later */}
            {/* <div className="h-24 bg-gray-800/50 backdrop-blur-sm border-t-2 border-gray-900/50">Stats Area</div> */}
          </div>
        </div>

        {/* Placeholder for Side Control Panel - to be added later */}
        {/* <div className="w-40 sm:w-48 bg-void-blue-deep p-3 sm:p-4 flex flex-col space-y-3 sm:space-y-4 justify-center rounded-r-xl shadow-lg border-t-2 border-r-2 border-gray-500/30 border-b-4 border-l-0 border-b-gray-800/50">Controls Area</div> */}
      </div>
    </div>
  );
};

export default ComputerShell;
