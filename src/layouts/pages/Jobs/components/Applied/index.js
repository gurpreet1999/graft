import DataTable from "examples/Tables/DataTable";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import EmptyState from "assets/images/jobs/empty-applied.png";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { userSelector } from "../../../../../store/user/selectors";
import { useGetAppliedJobs } from "../../../../../firebase/hooks/useGetJobs";

const columns = [
  { Header: "№", accessor: "id", width: "8%" },
  { Header: "Role", accessor: "role", width: "12%" },
  { Header: "Type of Establishment", accessor: "expertise", width: "12%" },
  { Header: "Experience", accessor: "experience", width: "8%" },
  { Header: "Postcode", accessor: "postcode", width: "8%" },
  { Header: "Status", accessor: "statusJobApplied", width: "12%" },
  { Header: "Action", accessor: "actionJobApplied", width: "6%" },
];

function Applied() {
  const { user } = useSelector(userSelector);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { jobs, loading, getJobs, nextPage, prevPage, totalCount, pages, currentPage } =
    useGetAppliedJobs();

  useEffect(() => {
    getJobs({ userId: user.id, limitPerPage: rowsPerPage });
  }, [user, rowsPerPage]);

  const handleNextPage = useCallback(async () => {
    if (currentPage === pages) return;
    await nextPage({ userId: user.id, limitPerPage: rowsPerPage });
  }, [jobs, rowsPerPage, currentPage, pages, nextPage]);

  const handlePrevPage = useCallback(async () => {
    if (currentPage === 1) return;
    await prevPage({ userId: user.id, limitPerPage: rowsPerPage });
  }, [jobs, rowsPerPage, currentPage, pages, prevPage]);

  const handleChangeRowsPerPage = useCallback(
    (numberOfRows) => {
      setRowsPerPage(numberOfRows);
    },
    [jobs]
  );

  const formatJobs = jobs
    .filter((job) => job?.id !== undefined)
    .map((job) => ({
      id: job.id,
      role: job.role,
      expertise: job.area_of_expertise,
      experience: job.years_of_experience,
      postcode: job.postcode || "N/A",
      statusJobApplied: job.status,
      actionJobApplied: job.id,
    }));

  if (loading) return <CircularProgress />;
  if (loading) return <CircularProgress />;

  return formatJobs.length === 0 ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <img src={EmptyState} alt="empty state" />
    </Box>
  ) : (
    <DataTable
      pages={pages}
      entriesPerPage={rowsPerPage}
      currentPage={currentPage}
      nextPage={handleNextPage}
      prevPage={handlePrevPage}
      showTotalEntries={totalCount}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      table={{
        columns,
        rows: formatJobs,
      }}
      type="jobs"
    />
  );
}

export default Applied;
