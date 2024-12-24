import { useEffect, useState, useCallback } from "react";
import propTypes from "prop-types";
import DataTable from "examples/Tables/DataTable";
import { useGetAppliedCandidates } from "../../../../../firebase/hooks/useGetAppliedCandidates";

export function CandidatesApplied({ jobId, emptyState, handleTabChange }) {
  const [columns, setColumns] = useState([
    { Header: "ID", accessor: "id", width: "5%" },
    { Header: "Name", accessor: "name", width: "15%" },
    { Header: "Status Verified", accessor: "statusVerified", width: "10%" },
    { Header: "Role", accessor: "role", width: "15%" },
    { Header: "Y. of exp.", accessor: "years", width: "10%" },
    { Header: "Postcode", accessor: "postcode", width: "10%" },
  ]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { candidates, totalCount, pages, currentPage, nextPage, prevPage, loading, getCandidates } =
    useGetAppliedCandidates();

  useEffect(() => {
    if (jobId) {
      getCandidates({ jobId, limitPerPage: rowsPerPage });
    }
  }, [rowsPerPage, jobId]);

  useEffect(() => {
    handleTabChange(totalCount);
  }, [totalCount]);

  const handleNextPage = useCallback(async () => {
    if (currentPage === pages) return;

    await nextPage({ jobId, limitPerPage: rowsPerPage });
  }, [jobId, rowsPerPage, currentPage, pages, nextPage]);

  const handlePrevPage = useCallback(async () => {
    if (currentPage === 1) return;

    await prevPage({ jobId, limitPerPage: rowsPerPage });
  }, [jobId, rowsPerPage, currentPage, pages, prevPage]);

  const handleChangeRowsPerPage = useCallback(
    async (numberOfRows) => {
      setRowsPerPage(numberOfRows);
      await getCandidates({ jobId, limitPerPage: numberOfRows });
    },
    [jobId]
  );

  const candidatesApplied = candidates.map((candidate, index) => ({
    id: index + 1,
    name: `${candidate.first_name} ${candidate.last_name}`,
    statusVerified: candidate.verified,
    role: candidate.experience.first_role_preference || candidate.experience.construction_role,
    area: candidate.experience.main_type_of_establishment,
    years: candidate.experience.years_of_experience,
    postcode: candidate.postal_code,
    site: candidate.experience.site_type,
  }));

  useEffect(() => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      if (
        candidatesApplied[0]?.site !== undefined &&
        !newColumns.some((col) => col.accessor === "site")
      ) {
        newColumns.splice(4, 0, { Header: "Card Type", accessor: "site", width: "18%" });
      }
      if (
        candidatesApplied[0]?.area !== undefined &&
        !newColumns.some((col) => col.accessor === "area")
      ) {
        newColumns.splice(4, 0, {
          Header: "Type of Establishment",
          accessor: "area",
          width: "18%",
        });
      }
      return newColumns;
    });
  }, [candidatesApplied]);

  if (candidatesApplied.length === 0 && !loading) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          paddingBottom: "50px",
        }}
      >
        <img
          src={emptyState}
          alt="Empty State"
          style={{ maxWidth: "100%", margin: "0 auto", height: "auto" }}
        />
      </div>
    );
  }

  return loading ? (
    <div>Loading...</div>
  ) : (
    <DataTable
      style={{
        width: "100%",
      }}
      showTotalEntries={totalCount}
      entriesPerPage={rowsPerPage}
      currentPage={currentPage}
      pages={pages}
      nextPage={handleNextPage}
      prevPage={handlePrevPage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      table={{
        columns,
        rows: candidatesApplied,
      }}
      type="candidates"
    />
  );
}

CandidatesApplied.propTypes = {
  jobId: propTypes.string.isRequired,
  emptyState: propTypes.string.isRequired,
  handleTabChange: propTypes.func.isRequired,
};
