import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
`;

const AvataUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1d9bf0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg{
        width: 50px;
    }
`;

const AvataImg = styled.img`
    width: 100%;
`;

const AvataInput = styled.input`
    display: none;
`;

const Name = styled.span`
    font-size: 22px;
`;

const Tweets = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export default function Profile(){
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweet] = useState<ITweet[]>([]);
    const onAvatarChange = async(e:React.ChangeEvent<HTMLInputElement>) => {
        const {files} = e.target;
        if(!user) return;

        if(files && files.length === 1){
            const file = files[0];
            const locationRef = ref(storage, `avatars/${user?.uid}`);
            const result = await uploadBytes(locationRef, file);
            const avatarURL = await getDownloadURL(result.ref);
            setAvatar(avatarURL);
            await updateProfile(user,{
                photoURL: avatarURL,
            })
        }
    }
    const fetchTweets = async()=> {
        const tweetQuery = query(
            collection(db,"tweets"),
            where("userId","==",user?.uid),
            orderBy("createdAt","desc"),
            limit(25),
        )
        const snapshot = await getDocs(tweetQuery);
        const ts = snapshot.docs.map(doc => {
            const {tweet, createdAt, userId, userName, photo} = doc.data();
            return{
                tweet,createdAt,userId,userName,photo,id:doc.id,
            }
        })
        setTweet(ts);
    }
    useEffect(()=>{
        fetchTweets();
    },[])

    return(
        <Wrapper>
            <AvataUpload htmlFor="avatar">
                {Boolean(avatar) ? <AvataImg src={avatar}/> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                </svg>
                }
            </AvataUpload>
            <AvataInput onChange={onAvatarChange} id="avatar" type="file" accept= "image/*" />
            <Name>{user?.displayName ?? "Anonymous"}</Name>
            <Tweets>
                {tweets.map(tw => <Tweet key={tw.id}{...tw} />)}
            </Tweets>
        </Wrapper>
    );
}