/* import { useEffect, useState } from "react";

const decayRate = 5; // every 2 minutes

export default function Pet() {
  const [mood, setMood] = useState("happy");
  const [hunger, setHunger] = useState(40);
  const [energy, setEnergy] = useState(80);

  useEffect(() => {
    const interval = setInterval(() => {
      setHunger((h) => h + decayRate);
      setEnergy((e) => e - decayRate);
    }, 120000); // every 2 min

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (hunger > 70) setMood("hungry");
    else if (energy < 30) setMood("sleepy");
    else setMood("happy");
  }, [hunger, energy]);

  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="text-6xl">{mood === "happy" ? "🐾" : "😿"}</div>
    </div>
  );
}

// src/components/PetStats.tsx
//import React from "react";
import { PetMood } from "../hooks/usePetMood";

export function PetStats({ mood }: { mood: PetMood }) {
  return (
    <div className="stats">
      <p>Hunger: {mood.hunger.toFixed(0)}%</p>
      <p>Tiredness: {mood.tiredness.toFixed(0)}%</p>
      <p>Entertainment: {mood.entertainment.toFixed(0)}%</p>
    </div>
  );
}
 */
