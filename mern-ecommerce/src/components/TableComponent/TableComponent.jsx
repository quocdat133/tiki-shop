import React, { useMemo, useState } from "react";
import { Button, Table } from "antd";
import Loading from "../LoadingComponent/Loading";
import { Excel } from "antd-table-saveas-excel";

const TableComponent = (props) => {
  const {
    selectionType = "checkbox",
    data: dataSource = [],
    isLoading = false,
    columns = [],
    handleDeleteMany,
  } = props;

  const newColumnExport = useMemo(() => {
    const arr = columns?.filter((col) => col.dataIndex !== "action");
    return arr;
  }, [columns]);

  const [rowSelectedKey, setRowSelectedKey] = useState([]);
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKey(selectedRowKeys);
    },
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKey);
  };

  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true,
      })
      .saveAs("Excel.xlsx");
  };
  return (
    <Loading isLoading={isLoading}>
      {rowSelectedKey.length > 0 && (
        <div
          style={{
            background: "#1d1ddd",
            width: "fit-content",
            color: "#fff",
            fontWeight: "bold",
            padding: "10px",
            cursor: "pointer",
          }}
          onClick={handleDeleteAll}
        >
          Xóa tất cả
        </div>
      )}
      <Button onClick={exportExcel} style={{ marginBottom: "10px" }}>
        Export Excel
      </Button>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={dataSource}
        {...props}
      />
    </Loading>
  );
};
export default TableComponent;
