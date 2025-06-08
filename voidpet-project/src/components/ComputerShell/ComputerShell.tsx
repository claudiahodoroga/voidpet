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

        {/* --- Opción 1: Huevo Simple (Ovalado) --- */}
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.topBarIcon}>
          <path d="M12 2C8.13 2 5 6.03 5 11c0 4.97 3.13 9 7 9s7-4.03 7-9c0-4.97-3.13-9-7-9z" />
        </svg> */}

        {/* --- Opción 2: Huevo Ligeramente Roto (Descomenta para usar) --- */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={styles.topBarIcon}
        >
          <path d="M12 2C8.13 2 5 6.03 5 11c0 2.3.88 4.4 2.33 6.01l-1.11 1.11L7.7 19.6l1.48-1.48.99.99 1.11-1.11.72.72 1.11-1.11.99.99 1.48-1.48 1.48 1.48-1.11 1.11C18.12 15.4 19 13.3 19 11c0-4.97-3.13-9-7-9z" />
        </svg>

        {/* --- Opción 3: Huevo con Criatura Asomándose (Descomenta para usar) --- */}
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.topBarIcon}>
          <path d="M12 2C8.13 2 5 6.03 5 11c0 2.3.88 4.4 2.33 6.01l-1.11 1.11L7.7 19.6l1.48-1.48.99.99 1.11-1.11.72.72 1.11-1.11.99.99 1.48-1.48 1.48 1.48-1.11 1.11C18.12 15.4 19 13.3 19 11c0-4.97-3.13-9-7-9zm-1-5a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd" />
          <path d="M12 7a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
        */}

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
