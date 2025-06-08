// src/components/ComputerShell/ComputerShell.tsx
import React from "react";
import styles from "./ComputerShell.module.css"; // Asegúrate de que este archivo CSS esté actualizado

// ... (El resto de tu código de ComputerShell.tsx) ...
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
        {/* --- NUEVOS ICONOS --- */}
        {/* Elige UNO de los siguientes SVGs. Descomenta el que quieras usar y comenta o elimina los otros. */}

        {/* Huevo Simple */}
        {
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={styles.topBarIcon}
          >
            <path d="M12,22 C18,22 20,16 20,12 C20,8 17,2 12,2 C7,2 4,8 4,12 C4,16 6,22 12,22Z" />
          </svg>
        }

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
      {controlsNode && controlsNode}
    </div>
  );
};

export default ComputerShell;
