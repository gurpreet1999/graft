import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";

export const renderSmallTable = (
  loading,
  emptyState,
  columns,
  rows,
  pages,
  rowsPerPage,
  currentPage,
  handleNextPage,
  handlePrevPage,
  totalCount,
  handleChangeRowsPerPage
) => {
  let content;

  if (loading) {
    content = <MDTypography variant="body1">Loading...</MDTypography>;
  }
  if (rows.length > 0) {
    content = (
      <DataTable
        pages={pages}
        entriesPerPage={rowsPerPage}
        currentPage={currentPage}
        nextPage={handleNextPage}
        prevPage={handlePrevPage}
        showTotalEntries={totalCount}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        isShowFooter={false}
        table={{
          columns,
          rows,
        }}
        type="small"
      />
    );
  } else {
    content = (
      <img
        src={emptyState}
        alt="Empty State"
        style={{ maxWidth: "330px", width: "100%", height: "auto", margin: "auto" }}
      />
    );
  }

  return content;
};
