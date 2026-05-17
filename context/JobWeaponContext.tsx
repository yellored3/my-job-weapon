"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Step1Data {
  meaning: string;
  reason: string;
}

export interface Step2Data {
  topValues: string[];
  bottomValues: string[];
}

export interface Step3Data {
  naturalRoles: string[];
  potentialRoles: string[];
  unpreferredRoles: string[];
}

export interface JobWeaponState {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
}

interface JobWeaponContextType {
  state: JobWeaponState;
  setStep1: (data: Step1Data) => void;
  setStep2: (data: Step2Data) => void;
  setStep3: (data: Step3Data) => void;
  resetForm: () => void;
}

const initialState: JobWeaponState = {
  step1: {
    meaning: "",
    reason: "",
  },
  step2: {
    topValues: [],
    bottomValues: [],
  },
  step3: {
    naturalRoles: [],
    potentialRoles: [],
    unpreferredRoles: [],
  },
};

const JobWeaponContext = createContext<JobWeaponContextType | undefined>(
  undefined
);

export const JobWeaponProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<JobWeaponState>(initialState);

  const setStep1 = (data: Step1Data) => {
    setState((prev) => ({ ...prev, step1: data }));
  };

  const setStep2 = (data: Step2Data) => {
    setState((prev) => ({ ...prev, step2: data }));
  };

  const setStep3 = (data: Step3Data) => {
    setState((prev) => ({ ...prev, step3: data }));
  };

  const resetForm = () => {
    setState(initialState);
  };

  return (
    <JobWeaponContext.Provider
      value={{ state, setStep1, setStep2, setStep3, resetForm }}
    >
      {children}
    </JobWeaponContext.Provider>
  );
};

export const useJobWeapon = () => {
  const context = useContext(JobWeaponContext);
  if (context === undefined) {
    throw new Error("useJobWeapon must be used within a JobWeaponProvider");
  }
  return context;
};
