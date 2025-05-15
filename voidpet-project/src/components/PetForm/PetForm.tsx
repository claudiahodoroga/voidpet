// src/components/PetNameForm/PetNameForm.tsx
import React, { useState } from "react";
import styles from "./PetForm.module.css"; // Import the CSS Module

interface PetNameFormProps {
  onCreatePet: (name: string) => void;
  isLoading?: boolean;
}

const PetNameForm: React.FC<PetNameFormProps> = ({
  onCreatePet,
  isLoading = false,
}) => {
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName && !isLoading) {
      onCreatePet(trimmedName);
    }
  };

  return (
    <div className={styles.petNameFormContainer}>
      <h2 className={styles.title}>Welcome</h2>
      <p className={styles.subtitle}>Please name your new companion.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="petNameInput" className={styles.inputLabel}>
            Pet Name
          </label>
          <input
            type="text"
            id="petNameInput"
            name="petName"
            placeholder="Enter pet name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
            required
            disabled={isLoading}
            maxLength={50}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || name.trim().length === 0}
          className={`${styles.submitButton} ${
            isLoading ? styles.submitButtonLoading : ""
          }`}
        >
          {isLoading ? "Creating..." : "Create Pet"}
        </button>
      </form>
    </div>
  );
};

export default PetNameForm;
