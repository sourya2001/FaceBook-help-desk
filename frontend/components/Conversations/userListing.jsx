import React from "react";
import { Refresh } from "../icons";
import { conversationState, activeConvState } from "../../atoms/atom";
import { useRecoilState, useRecoilValue } from "recoil";


function UserListing({ className }) {
	const convState = useRecoilValue(conversationState);
	console.log('**',convState);
	const [activeConv, setActiveConv] = useRecoilState(activeConvState);
	return (
		<div className={className + " w-full  h-screen"}>
			<div className='bar flex justify-between items-center border-gray-300 border-b-1 py-5 px-4'>
				<span className='font-semibold text-xl'>Chats</span>
				<Refresh className='h-6' fill='none' />
			</div>
			{convState.length ? (
				<div className='list'>
					<ul>
						{convState.map((item, index) => {
							return (
								<li
									key={index}
									onClick={() => {
										console.log(item.sender_id);
										setActiveConv((activeConvState) => item);
									}}>
									<div className='h-auto p-4 border-1 border-solid border-gray-200'>
										<div className='head grid grid-cols-10 items-center mb-2'>
											<input
												type='checkbox'
												className='col-span-1'
												name=''
												id=''
											/>
											<div className='name-type col-span-8 text-left'>
												<div className='name font-semibold'>
													{item.user.name}
												</div>
												<div className='type font-medium'>Facebook DM</div>
											</div>
											<div className='elapse col-span-1'>10m</div>
										</div>
										
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			) : (
				<div className='w-full py-10 text-center'>No unread chats</div>
			)}
		</div>
	);
}

export default UserListing;
