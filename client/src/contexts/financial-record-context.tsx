// this is state manager in this application where all our state and func will exist
import React, { createContext, useState, useContext } from "react";


// use interface that context will contain, that is actually same as we use in schema so copy from there
interface FinancialRecord {
    id?:string; // in backend dont use it bcz in that automatic generate in mongodb
    userId: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    paymentMethod: string;
  }

  // here defining the context type
  interface FinancialRecordsContextType {
    records: FinancialRecord[];
    addRecord: (record: FinancialRecord) => void;
    //updateRecord: (id: string, newRecord: FinancialRecord) => void;
    //deleteRecord: (id: string) => void;
  }
  
  // create context
  export const FinancialRecordsContext = createContext<
  FinancialRecordsContextType | undefined
  >(undefined);

  export const FinancialRecordsProvider = ({children,}:
    {
        children: React.ReactNode;
    }) => {
      // create state
      const [records, setRecords] = useState<FinancialRecord[]>([]);

      const addRecord = async (record: FinancialRecord) => {
        // fetch api i.e. running on the local host so link write like this..http...and port that we have defined 3001 in sever file etc and display records
        const response = await fetch("http://localhost:3001/financial-records", {
           method: "POST",
           body: JSON.stringify(record),
           headers: {
            "Content-Type": "application/json",
           },
          });

          try {
           if (response.ok) {
            const newRecord = await response.json();
            setRecords((prev) => [...prev, newRecord]);
           } 
        } catch (err) {}
      };
      

      return (
        <FinancialRecordsContext.Provider value={{ records,addRecord }}>
          {" "}
          {children}
        </FinancialRecordsContext.Provider>
      );
    };

    export const useFinancialRecords = () => {
      const context = useContext<FinancialRecordsContextType | undefined>(
        FinancialRecordsContext
      );

      if(!context){
        throw new Error("useFinancialRecords must be used within a FinancialRecordsProvider");
      }

      return context;
    };

    