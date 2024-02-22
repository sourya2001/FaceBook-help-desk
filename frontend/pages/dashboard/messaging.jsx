// import React from "react";
// import Sidebar 		  from "../../components/base/Layout/Sidebar";
// import UserListing    from "../../components/Conversations/userListing";
// import Conversation   from "../../components/Conversations/Messaging";
// import SenderProfile  from "../../components/Conversations/senderProfile";
// import { io } from "socket.io-client";
// import { useSession, getSession } from "next-auth/client";
// import { useRecoilState, useRecoilValue } from "recoil";
// import {
// 	activeConvState,
// 	conversationState,
// 	pageState,
// 	profileState,
// } 
// from "../../atoms/atom";
// import { setConv, setSendConv } from "../../utils/helpers";
// import { fetchProfile, getAccount, getProfile } from "../../api";

// const Conversations = () => {
// 	var socket;
// 	const [session, loading] = useSession();
// 	const [page, setPage] = useRecoilState(pageState);
// 	const [convState, setConvState] = useRecoilState(conversationState);
// 	const activeConv = useRecoilValue(activeConvState);
// 	const [profile, setProfile] = useRecoilState(profileState);

// 	React.useEffect(async () => {
// 		if (session) {
// 			const accounts = await getAccount(session.user.email);
// 			setPage(accounts.data.data.accounts[0]);
// 			const profile = await getProfile(session.user.email);
// 			const user = profile.data.data.user;
// 			setProfile((profile) => user);
// 		}
// 	}, [session]);

// 	React.useEffect(async () => {
// 		if (page && session && Object.keys(page).length) 
// 		{
// 			socket = io("localhost:8000");
// 			socket.on("connect", () => {
// 			socket.emit("/init", { pageId: page.id });
// 			});
// 			socket.on("connect_error", (err) => {
// 			console.error(err);
// 		});

// 			const newmsgCb = async (data) => {
// 			const user = await fetchProfile(session.user.email, data.sender.id);
// 			setConvState((convState) =>
// 				setConv(convState, data, user.data.data.details),
// 			);
// 		};
// 		socket.on("/new_message", newmsgCb);
// 		}
// 	}
// 	, [session, page]);

	
// 	return (
// 		<div className=''>
// 			<Sidebar active='conv' />
// 			<div className='ml-20 grid grid-cols-10'>
// 				<UserListing className='border-r-1 border-gray-300 border-solid col-span-2' />
// 				<Conversation className='col-span-5' />
// 			</div>
// 		</div>
// 	);
// };

// export default Conversations;


import React, { useEffect } from "react";
import Sidebar from "../../components/base/Layout/Sidebar";
import UserListing from "../../components/Conversations/userListing";
import Conversation from "../../components/Conversations/Messaging";
import { io } from "socket.io-client";
import { useSession } from "next-auth/client";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activeConvState,
  conversationState,
  pageState,
  profileState,
} from "../../atoms/atom";
import { setConv, setSendConv } from "../../utils/helpers";
import { fetchProfile, getAccount, getProfile } from "../../api";

const Conversations = () => {
  var socket;
  const [session, loading] = useSession();
  const [page, setPage] = useRecoilState(pageState);
  const [convState, setConvState] = useRecoilState(conversationState);
  const activeConv = useRecoilValue(activeConvState);
  const [profile, setProfile] = useRecoilState(profileState);

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        try {
          const accounts = await getAccount(session.user.email);
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
  }, [session, setPage, setProfile]);

  useEffect(() => {
    if (page && session && Object.keys(page).length) {
      socket = io("localhost:8000");

      socket.on("connect", () => {
        socket.emit("/init", { pageId: page.id });
      });

      socket.on("connect_error", (err) => {
        console.error(err);
      });

      const newmsgCb = async (data) => {
        try {
          const user = await fetchProfile(session.user.email, data.sender.id);
          setConvState((convState) =>
            setConv(convState, data, user.data.data.details),
          );
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      socket.on("/new_message", newmsgCb);

      return () => {
        // Cleanup the socket connection on component unmount
        socket.disconnect();
      };
    }
  }, [session, page, setConvState]);

  return (
    <div className=''>
      <Sidebar active='conv' />
      <div className='ml-20 grid grid-cols-10'>
        <UserListing className='border-r-1 border-gray-300 border-solid col-span-2' />
        <Conversation className='col-span-5' />
      </div>
    </div>
  );
};

export default Conversations;
