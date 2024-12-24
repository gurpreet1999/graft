/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-no-useless-fragment */
import { useMemo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTable, usePagination, useGlobalFilter, useSortBy } from "react-table";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import Autocomplete from "@mui/material/Autocomplete";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDPagination from "components/MDPagination";
import DataTableHeadCell from "examples/Tables/DataTable/DataTableHeadCell";
import DataTableBodyCell from "examples/Tables/DataTable/DataTableBodyCell";
import { renderTableRow } from "./helpers";
import { renderTableHeader, renderTableInner, renderTableActions } from "./helpers-mobile";

function DataTable({
  entriesPerPage,
  showTotalEntries,
  table,
  pagination,
  isSorted,
  pages,
  currentPage,
  nextPage,
  prevPage,
  handleChangeRowsPerPage,
  handleDeleteItem,
  handleSuspendUser,
  isShowFooter,
  type,
}) {
  const defaultValue = entriesPerPage;
  const entries = entriesPerPage.entries
    ? entriesPerPage.entries.map((el) => el.toString())
    : ["5", "10", "15", "20", "25"];
  const columns = useMemo(() => table.columns, [table]);
  const data = useMemo(() => table.rows, [table]);

  const tableInstance = useTable(
    { columns, data, initialState: { pageIndex: 0 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileSize(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setPageSize,
    state: { pageSize },
  } = tableInstance;

  useEffect(() => setPageSize(defaultValue || 10), [defaultValue]);
  const setEntriesPerPage = (value) => setPageSize(value);

  const setSortedValue = (column) => {
    let sortedValue;

    if (isSorted && column.isSorted) {
      sortedValue = column.isSortedDesc ? "desc" : "asce";
    } else if (isSorted) {
      sortedValue = "none";
    } else {
      sortedValue = false;
    }

    return sortedValue;
  };

  if (isMobileSize && type !== "small") {
    return (
      <div
        style={{
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {table.rows.map((row) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "8px",
                border: "1px solid #E5E5E5",
                borderRadius: "8px",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {renderTableHeader(type, row)}
              </div>
              {renderTableInner(type, row)}
              {renderTableActions(type, row, handleDeleteItem, handleSuspendUser)}
            </div>
          ))}
        </div>
        {isShowFooter && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: isMobileSize ? "6px" : "20px",
              gap: isMobileSize ? "5px" : "10px",
            }}
          >
            {entriesPerPage && (
              <MDBox display="flex" gap={2} alignItems="center" sx={{ border: "none" }}>
                <MDTypography
                  variant="caption"
                  style={{
                    color: "#5F5F5F",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                >
                  {isMobileSize ? "" : "Rows per page:"}
                </MDTypography>
                <Autocomplete
                  disableClearable
                  value={pageSize.toString()}
                  options={entries}
                  onChange={(event, newValue) => {
                    setEntriesPerPage(parseInt(newValue, 10));
                    handleChangeRowsPerPage(parseInt(newValue, 10));
                  }}
                  size="xsmall"
                  sx={{
                    width: "70px",
                    outline: "none",
                    border: "none",
                  }}
                  renderInput={(params) => (
                    <MDInput variant="standard" {...params} sx={{ border: "none !important" }} />
                  )}
                />
              </MDBox>
            )}
            {showTotalEntries && (
              <MDBox>
                <MDTypography
                  style={{
                    color: "#5F5F5F",
                    fontSize: "12px",
                    fontWeight: "400",
                  }}
                >
                  {showTotalEntries} results
                </MDTypography>
              </MDBox>
            )}
            <MDPagination variant="gradient" color="info">
              <MDPagination item onClick={() => currentPage > 1 && prevPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
              </MDPagination>

              <MDPagination item onClick={() => currentPage < pages && nextPage()}>
                <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
              </MDPagination>
            </MDPagination>
          </div>
        )}
      </div>
    );
  }

  return (
    <TableContainer sx={{ boxShadow: "none", border: "1px solid #DCE7ED", borderRadius: "8px" }}>
      <Table {...getTableProps()}>
        <MDBox component="thead">
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <DataTableHeadCell
                  {...column.getHeaderProps(isSorted && column.getSortByToggleProps())}
                  width={column.width ? column.width : "auto"}
                  align={column.align ? column.align : "left"}
                  sorted={setSortedValue(column)}
                  style={{
                    color: "#1C1C1C",
                    fontSize: "14px",
                    fontWeight: "500",
                    textTransform: "capitalize",
                  }}
                >
                  {column.render("Header")}
                </DataTableHeadCell>
              ))}
            </TableRow>
          ))}
        </MDBox>
        <TableBody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <DataTableBodyCell {...cell.getCellProps()}>
                    {renderTableRow(cell, handleDeleteItem, handleSuspendUser, isShowFooter)}
                  </DataTableBodyCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {isShowFooter && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: isMobileSize ? "6px" : "20px",
            borderTop: "1px solid #DCE7ED",
            gap: isMobileSize ? "5px" : "10px",
          }}
        >
          {entriesPerPage && (
            <MDBox display="flex" gap={2} alignItems="center" sx={{ border: "none" }}>
              <MDTypography
                variant="caption"
                style={{
                  color: "#5F5F5F",
                  fontSize: "12px",
                  fontWeight: "400",
                }}
              >
                {isMobileSize ? "" : "Rows per page:"}
              </MDTypography>
              <Autocomplete
                disableClearable
                value={pageSize.toString()}
                options={entries}
                onChange={(event, newValue) => {
                  setEntriesPerPage(parseInt(newValue, 10));
                  handleChangeRowsPerPage(parseInt(newValue, 10));
                }}
                size="xsmall"
                sx={{
                  width: "70px",
                  outline: "none",
                  border: "none",
                }}
                renderInput={(params) => (
                  <MDInput variant="standard" {...params} sx={{ border: "none !important" }} />
                )}
              />
            </MDBox>
          )}
          {showTotalEntries && (
            <MDBox>
              <MDTypography
                style={{
                  color: "#5F5F5F",
                  fontSize: "12px",
                  fontWeight: "400",
                }}
              >
                {showTotalEntries} results
              </MDTypography>
            </MDBox>
          )}
          <MDPagination
            variant={pagination.variant ? pagination.variant : "gradient"}
            color={pagination.color ? pagination.color : "info"}
          >
            <MDPagination item onClick={() => currentPage > 1 && prevPage()}>
              <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
            </MDPagination>

            <MDPagination item onClick={() => currentPage < pages && nextPage()}>
              <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
            </MDPagination>
          </MDPagination>
        </div>
      )}
    </TableContainer>
  );
}

DataTable.defaultProps = {
  entriesPerPage: { defaultValue: 10, entries: [5, 10, 15, 20, 25] },
  canSearch: false,
  showTotalEntries: true,
  pagination: { variant: "gradient", color: "info" },
  isSorted: true,
  noEndBorder: false,
  handleSuspendUser: () => {},
  isShowFooter: true,
};

DataTable.propTypes = {
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.shape({
      defaultValue: PropTypes.number,
      entries: PropTypes.instanceOf(Array),
    }),
    PropTypes.bool,
  ]),
  isShowFooter: PropTypes.bool,
  canSearch: PropTypes.bool,
  showTotalEntries: PropTypes.bool,
  table: PropTypes.instanceOf(Object).isRequired,
  pages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  nextPage: PropTypes.func.isRequired,
  prevPage: PropTypes.func.isRequired,
  handleDeleteItem: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  handleSuspendUser: PropTypes.func,
  pagination: PropTypes.shape({
    variant: PropTypes.oneOf(["contained", "gradient"]),
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
    ]),
  }),
  isSorted: PropTypes.bool,
  noEndBorder: PropTypes.bool,
  type: PropTypes.string.isRequired,
};

export default DataTable;
