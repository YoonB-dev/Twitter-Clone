import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.5);
    border-radius: 15px;
`;

const Colume = styled.div``;

const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 15px;
`;

const UserName = styled.span`
    font-weight: 600;
    font-size: 15px;
`;

const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
`;

const DeleteButton = styled.button`
    background-color: tomato;
    color: white;
    font-weight: 600;
    border:0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

const EditButton = styled.button`
    margin-right: 12px;
    background-color: #1d9cf0;
    color: white;
    font-weight: 600;
    border:0;
    font-size: 12px;
    padding: 5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

export default function Tweet({userName, photo, tweet, userId, id}:ITweet){
    const user = auth.currentUser;
    const onDelete = async() => {
        const ok = confirm("트윗을 삭제하시겠습니까?");
        if(user?.uid !== userId || !ok)return;
        try{
            await deleteDoc(doc(db, "tweets", id));
            if(photo){
                const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        }catch(e){
            console.log(e);
        }finally{
            //
        }
    }

    const onEdit = () => {
        console.log("편집 시작");
    }
    return(
        <Wrapper>
            <Colume>
                <UserName>{userName}</UserName>
                <Payload>{tweet}</Payload>
                {user?.uid === userId ? (
                    <>
                    <EditButton onClick={onEdit}>편집</EditButton>
                    <DeleteButton onClick={onDelete}>삭제</DeleteButton>
                    </>
                    ) : null}
            </Colume>
            <Colume>
            {photo ? (
                <Photo src={photo} />
            ) : null}
            </Colume>
        </Wrapper>
    )
}