/*export const FinancialRecordList = () => {
    return <div>Record List</div>
};*/
import { useMemo } from "react";
import { FinancialRecord,useFinancialRecords } from "../../contexts/financial-record-context";
import { useTable, Column, CellProps, Row } from "react-table";

    interface EditableCellProps extends CellProps<FinancialRecord> {
        updateRecord: (rowIndex: number, columnId: string, value: any) => void;
        editable: boolean;
    }

    // for making a separate component
    const EditableCell: React.FC<EditableCellProps> = ({value: initialValue, row, column, updateRecord, editable}) => {
        const [isEditing, setEditing] = useState(false)
        const [value,setValue] = useState(initialValue)

        return (
               <div onClick={() => editable && setEditing(true)}> 
                   {isEditing ? 
                   <input value={value} onChange={(e) => setValue(e.target.value)} autoFocus style={{width: "100%"}}/>
                    : typeof value === "string" 
                    ? (value)
                    : (value.toString())}
                    </div>)
    }
    


    export const FinancialRecordList = () => {
    const { records } = useFinancialRecords();

    const columns : Array<Column<FinancialRecord>> = useMemo(() => [
        {
            Header: "Description",
            accessor: "description",
            cell: (props) => (
                <EditableCell {...props} updateRecord={() => null} editable={true} />
            ),
        },
        {
            Header: "Amount",
            accessor: "amount",
            cell: (props) => (
                <EditableCell {...props} updateRecord={() => null} editable={true} />
            ),
        },
        {
            Header: "Category",
            accessor: "category",
            cell: (props) => (
                <EditableCell {...props} updateRecord={() => null} editable={true} />
            ),
        },
        {
            Header: "Payment Method",
            accessor: "paymentMethod",
            cell: (props) => (
                <EditableCell {...props} updateRecord={() => null} editable={true} />
            ),
        },
        {
            Header: "Date",
            accessor: "date",
            cell: (props) => (
                <EditableCell {...props} updateRecord={() => null} editable={false} />
            ),
        },
        {
            Header: "Delete",
            accessor: "delete",
            cell: ({row}) => <button onClick={() => null} className="button">
                {" "}
                Delete {" "}
            </button>
        },
    ],
    []
);
    
    const {getTableProps, getTableBodyProps,headerGroups,rows,prepareRow} = useTable({
        columns,
        data: records,
    });

    return ( 
       <div className="table-container">
          <table {...getTableProps()} className="table">
            <thead>
                {headerGroups.map((hg) => (
                    <tr {...hg.getHeaderGroupProps()}>
                        {hg.headers.map((column) => (
                            <th {...column.getHeaderProps()}> {column.render("Header")}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row,idx) => {
                    prepareRow(row);
                    return <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>
                                {cell.render("Cell")}
                            </td>
                        ))}
                    </tr>
                })}
            </tbody>
          </table>
       </div>   
    );
};
