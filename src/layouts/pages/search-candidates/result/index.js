import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import EmptyState from "assets/images/search/EmptyState.png";

const hospitalityColumns = [
  { Header: "№", accessor: "id", width: "10%" },
  { Header: "Name", accessor: "name", width: "18%" },
  { Header: "Status", accessor: "statusVerified", width: "18%" },
  { Header: "Role", accessor: "role", width: "18%" },
  { Header: "Sector (Hospitality)", accessor: "area", width: "18%" },
  { Header: "Y. of exp.", accessor: "years", width: "8%" },
  { Header: "Postcode", accessor: "postcode", width: "8%" },
];

const constructionColumns = [
  { Header: "№", accessor: "id", width: "10%" },
  { Header: "Name", accessor: "name", width: "18%" },
  { Header: "Status", accessor: "statusVerified", width: "18%" },
  { Header: "Role", accessor: "constructionRole", width: "18%" },
  { Header: "Card Type", accessor: "constructionCardType", width: "18%" },
  { Header: "Y. of exp.", accessor: "years", width: "8%" },
  { Header: "Postcode", accessor: "postcode", width: "8%" },
];

export default function Result({
  candidates,
  showTotalEntries,
  pages,
  currentPage,
  nextPage,
  prevPage,
  handleChangeRowsPerPage,
  rowsPerPage,
  loading,
  sector,
}) {
  const candidatesTableData = useMemo(
    () =>
      candidates.map((candidate, index) => ({
        id: index + 1,
        name: `${candidate.first_name} ${candidate.last_name}`,
        statusVerified: candidate.verified,
        role: candidate.experience.first_role_preference,
        area: candidate.experience.main_type_of_establishment,
        years: candidate.experience.years_of_experience,
        postcode: candidate.postal_code,
        constructionCardType: candidate.experience.construction_card_type,
        constructionRole: candidate.experience.construction_role,
      })),
    [candidates]
  );
  const [isMobileSize, setIsMobileSize] = useState(window.innerWidth < 768);

  useEffect(() => {
    function handleResize() {
      setIsMobileSize(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <MDBox
      mt={3}
      style={{
        backgroundColor: "white",
        padding: isMobileSize ? "8px" : "16px 24px",
        boxShadow:
          "0px 4px 12px 4px rgba(38, 42, 63, 0.06), 0px 2px 4px -1px rgba(48, 57, 65, 0.16)",
        borderRadius: "24px",
      }}
    >
      {loading ? (
        <MDBox
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MDTypography variant="h6">Loading...</MDTypography>
        </MDBox>
      ) : (
        <>
          <MDTypography variant="h6" pb={3}>
            Search Results
          </MDTypography>
          {candidates.length === 0 ? (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                paddingBottom: "50px",
              }}
            >
              <img
                src={EmptyState}
                alt="Empty State"
                style={{ maxWidth: "100%", margin: "0 auto", height: "auto" }}
              />
            </div>
          ) : (
            <DataTable
              style={{
                width: "100%",
              }}
              showTotalEntries={showTotalEntries}
              entriesPerPage={rowsPerPage}
              pages={pages}
              currentPage={currentPage}
              nextPage={nextPage}
              prevPage={prevPage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              table={{
                columns: sector === "Hospitality" ? hospitalityColumns : constructionColumns,
                rows: candidatesTableData,
              }}
              type="candidates"
            />
          )}
        </>
      )}
    </MDBox>
  );
}

Result.propTypes = {
  candidates: PropTypes.arrayOf({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    verified: PropTypes.bool.isRequired,
    experience: PropTypes.shape({
      first_role_preference: PropTypes.string.isRequired,
      main_type_of_establishment: PropTypes.string.isRequired,
      years_of_experience: PropTypes.string.isRequired,
    }),
    postal_code: PropTypes.string.isRequired,
  }).isRequired,
  showTotalEntries: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  nextPage: PropTypes.func.isRequired,
  prevPage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  sector: PropTypes.string.isRequired,
};
