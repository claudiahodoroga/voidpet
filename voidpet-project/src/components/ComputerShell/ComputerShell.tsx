// src/components/ComputerShell/ComputerShell.tsx
import React from "react";
import styles from "./ComputerShell.module.css"; // Importa el CSS Module actualizado

// ... (El componente TopBar no necesita cambios, puedes mantenerlo aquí o importarlo) ...
interface TopBarProps {
  petName?: string;
  showTitle?: boolean;
}
export const TopBar: React.FC<TopBarProps> = ({
  petName,
  showTitle = true,
}) => {
  return (
    <div className={styles.topBar}>
      <div className={styles.topBarTitleContainer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={styles.topBarIcon}
        >
          <path d="M12 2.25c-5.162 0-9.755 3.09-11.482 7.5H1.22a.75.75 0 00-.748.8V12a.75.75 0 00.343.642S2.076 13.5 3.06 13.5H3.6c.094.613.296 1.207.595 1.772.915 1.725 2.753 3.028 5.096 3.728C9.839 19.091 12 21.75 12 21.75s2.161-2.659 2.709-2.75c2.343-.699 4.181-2.003 5.096-3.728.299-.565.501-1.159.595-1.772h.541c.982 0 1.224-.608 1.224-.608A.75.75 0 0022.8 12v-.75a.75.75 0 00-.748-.8h-1.273C19.028 5.34 14.437 2.25 12 2.25zM12 3.75a7.713 7.713 0 015.955 2.897L12 12.384l-5.955-5.737A7.713 7.713 0 0112 3.75zM4.514 10.5c.64-.804 1.343-1.518 2.086-2.13l5.4 5.207-5.4 5.207c-.743-.612-1.446-1.326-2.086-2.13v-6.154zm14.972 0v6.154c-.64.804-1.343 1.518 2.086 2.13l-5.4-5.207 5.4-5.207c.743.612 1.446 1.326 2.086 2.13z" />
        </svg>
        {showTitle && (
          <span className={styles.topBarTitle}>
            {petName ? `Voidpet - ${petName}` : "Voidpet"}
          </span>
        )}
      </div>
      <div className={styles.statusLight}></div>
    </div>
  );
};

interface ComputerShellProps {
  children: React.ReactNode;
  showTopBarTitle?: boolean;
  petName?: string;
  statsNode?: React.ReactNode;
  controlsNode?: React.ReactNode;
}

const ComputerShell: React.FC<ComputerShellProps> = ({
  children,
  showTopBarTitle = true,
  petName,
  statsNode,
  controlsNode,
}) => {
  return (
    <div className={styles.computerStructure}>
      {/* Columna Izquierda: Pantalla */}
      <div className={styles.screenWrapper}>
        <div className={styles.innerScreenFrame}>
          <TopBar petName={petName} showTitle={showTopBarTitle} />
          <main className={styles.screenContent}>{children}</main>
          {statsNode && <div className={styles.statsBarArea}>{statsNode}</div>}
        </div>
      </div>

      {/* Columna Derecha: Controles (si existen) */}
      {controlsNode &&
        // No necesita una clase contenedora extra, el componente Controls ya tiene la suya
        controlsNode}
    </div>
  );
};

export default ComputerShell;
