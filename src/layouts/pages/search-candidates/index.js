import React, { useEffect, useState } from "react";
import { useWindowSize } from "utilities/useWindowSize";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import Button from "@mui/material/Button";
import hospitalityIcon from "assets/images/search/hospitality.png";
import constructionIcon from "assets/images/search/construction.png";
import backIcon from "assets/images/icons/back.svg";
import { getCandidatesCountBySector } from "../../../firebase/search-candidates";
import { SearchFlow } from "./search-flow";

export default function Search() {
  const pageSize = useWindowSize({ marginDesktop: -4, marginMobile: 4 });
  const [choosenSector, setChoosenSector] = useState("");

  const [hospitalityCandidatesCount, setHospitalityCandidatesCount] = useState(0);
  const [constructionCandidatesCount, setConstructionCandidatesCount] = useState(0);

  useEffect(() => {
    Promise.all([
      getCandidatesCountBySector("Hospitality"),
      getCandidatesCountBySector("Construction"),
    ]).then(([hospitalityCount, constructionCount]) => {
      setHospitalityCandidatesCount(hospitalityCount);
      setConstructionCandidatesCount(constructionCount);
    });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        mt={pageSize}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      {choosenSector === "" ? (
        <div style={{ display: "flex", gap: "24px", flexDirection: "row", flexWrap: "wrap" }}>
          <Button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "325px",
              padding: "16px 24px",
              backgroundColor: "#fff",
              gap: "16px",
              flexDirection: "column",
            }}
            onClick={() => setChoosenSector("Hospitality")}
          >
            <div
              style={{
                position: "relative",
                height: "32px",
                width: "100%",
              }}
            >
              <img
                src={hospitalityIcon}
                alt="hospitality"
                style={{
                  position: "absolute",
                  height: "74px",
                  width: "70px",
                  top: "-35px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
            <div
              style={{
                color: "#353F46",
                textTransform: "capitalize",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                paddingBottom: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  textTransform: "capitalize",
                }}
              >
                Hospitality
              </span>
              <span
                style={{
                  fontSize: "14px",
                  textTransform: "capitalize",
                  fontWeight: "300",
                }}
              >
                Candidates Currently Active
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#DCE7ED",
              }}
            />
            <span
              style={{
                color: "#353F46",
                fontSize: "16px",
                textTransform: "capitalize",
              }}
            >
              {hospitalityCandidatesCount} candidates
            </span>
          </Button>
          <Button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "325px",
              padding: "16px 24px",
              backgroundColor: "#fff",
              gap: "16px",
              flexDirection: "column",
            }}
            onClick={() => setChoosenSector("Construction")}
          >
            <div
              style={{
                position: "relative",
                height: "32px",
                width: "100%",
              }}
            >
              <img
                src={constructionIcon}
                alt="construction"
                style={{
                  position: "absolute",
                  height: "74px",
                  width: "70px",
                  top: "-35px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
            <div
              style={{
                color: "#353F46",
                textTransform: "capitalize",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                paddingBottom: "6px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  textTransform: "capitalize",
                }}
              >
                Construction
              </span>
              <span
                style={{
                  fontSize: "14px",
                  textTransform: "capitalize",
                  fontWeight: "300",
                }}
              >
                Candidates Currently Active
              </span>
            </div>
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#DCE7ED",
              }}
            />
            <span
              style={{
                color: "#353F46",
                fontSize: "16px",
                textTransform: "capitalize",
              }}
            >
              {constructionCandidatesCount} candidates
            </span>
          </Button>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Button
            style={{
              height: "42px",
              width: "88px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: "8px",
            }}
            onClick={() => setChoosenSector("")}
          >
            <img src={backIcon} alt="back" />
            <span>Back</span>
          </Button>
          <SearchFlow sector={choosenSector} />
        </div>
      )}
    </DashboardLayout>
  );
}
