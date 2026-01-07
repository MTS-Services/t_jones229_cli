"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface FormDataType {
  [key: string]: any;
}

interface FormContextType {
  formData: FormDataType;
  updateFormData: (data: FormDataType) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<FormDataType>({});

  const updateFormData = (newData: FormDataType) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormData = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormData must be used within a FormProvider");
  }
  return context;
};
