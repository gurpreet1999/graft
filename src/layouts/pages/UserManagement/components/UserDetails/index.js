import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MDBox from "components/MDBox";
import Header from "./components/Header";
import BasicInfoRecruiter from "./components/BasicInfoRecruiter";
import BasicInfo from "./components/BasicInfo";
import { getUserById } from "../../../../../firebase/user";

function UserDetails() {
  const [user, setUser] = useState({});
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const [changeStatus, setChangeStatus] = useState(false);

  useEffect(() => {
    getUserById(userId).then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? (
    <MDBox mt={6}>
      <Header user={user}>
        <MDBox mb={3} />
        {user.role === "recruiter" && <BasicInfoRecruiter user={user} />}
        {user.role === "candidate" && (
          <BasicInfo user={user} changeStatus={changeStatus} setChangeStatus={setChangeStatus} />
        )}
      </Header>
    </MDBox>
  ) : (
    <div>No user found</div>
  );
}

export default UserDetails;
