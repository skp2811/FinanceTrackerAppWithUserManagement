// this is state manager in this application where all our state and func will exist
import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from '@clerk/clerk-react'


// use interface that context will contain, that is actually same as we use in schema so copy from there


export interface FinancialRecord {
    _id?:string; // in backend dont use it bcz in that automatic generate in mongodb
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
    updateRecord: (id: string, newRecord: FinancialRecord) => void;
    deleteRecord: (id: string) => void;
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
      const { user } = useUser(); // use useUser that we get user from clerk i.e. user id get from here
      
      // now add this function for showing the list of database
      const fetchRecord = async () => {
        if(!user) return;
        const response = await fetch(
          `http://localhost:3001/financial-records/getAllByUserID/${user.id}`
        );

        if (response.ok) {
          const records = await response.json(); // if response is ok then this will fetch the record
          console.log(records);
          setRecords(records);
        }
      };

      useEffect(() => {
        fetchRecord();
      }, [user]);

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
      
      const updateRecord = async (id: string, newRecord: FinancialRecord) => {
        //if(!user) return;
        // fetch api i.e. running on the local host so link write like this..http...and port that we have defined 3001 in sever file etc and display records
        const response = await fetch(
          `http://localhost:3001/financial-records/${id}`, 
          {
           method: "PUT", // put request as i want to edit the record
           body: JSON.stringify(newRecord),
           headers: {
            "Content-Type": "application/json",
           },
          });

          try {
           if (response.ok) {
            const newRecord = await response.json();
            setRecords((prev) => prev.map((record) => {
              if (record._id === id){
                return newRecord;
              } else {
                return record;
              }
            }));
           } 
        } catch (err) {}
      };

      const deleteRecord = async(id: string) => {
        const response = await fetch(
          `http://localhost:3001/financial-records/${id}`, {
           method: "DELETE",
          });

          try {
           if (response.ok) {
            const deleteRecord = await response.json();
            setRecords((prev) => prev.filter((record) => record._id !== deleteRecord._id));
           } 
        } catch (err) {}
      };

      return (
        <FinancialRecordsContext.Provider value={{ records, addRecord, updateRecord, deleteRecord }}>
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

    