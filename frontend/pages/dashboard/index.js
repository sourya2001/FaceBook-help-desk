import { useSession } from "next-auth/client";
import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { pageState, profileState } from "../../atoms/atom";
import Sidebar from "../../components/base/Layout/Sidebar";
import Conversations from "../../components/Conversations/Messaging";
import { getAccount, getProfile } from "../../api";

function Dashboard() {
  const [session, loading] = useSession();
  const [active, setActive] = useState("");
  const [page, setPage] = useRecoilState(pageState);
  const [profile, setProfile] = useRecoilState(profileState);

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        try {
          const accounts = await getAccount(session.user.email);
          console.log(accounts.data.data.accounts[0]);
          setPage(accounts.data.data.accounts[0]);
          const profile = await getProfile(session.user.email);
          const user = profile.data.data.user;
          setProfile(user);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [session]);

  return (
    <div>
      <Sidebar active={active} setActive={setActive} />
      <Conversations />
    </div>
  );
}

export default Dashboard;
