import React, { useEffect, useState } from "react";
import { useAuth0, User } from "@auth0/auth0-react";
import {Button,Spin, Image, Modal, Form, Input, Message, Radio} from 'shineout';
import {Redirect} from 'react-router-dom';
interface UserEdit {
  name: string;
  nickname: string;
  picture: string;
  email: string;
  color: string;
}

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently} = useAuth0();
  const [userMetadata, setUserMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit,setShowEdit] = useState(false);
  const [showCode,setShowCode] = useState(false);
  const [showCred,setShowCred] = useState(false);
  const [update,setUpdate] = useState(true);

  const fetchUserMetaData = async (response: any = undefined) => {
    let token = null;
    if(!response){
      try {
        const accessToken = await getAccessTokenSilently({
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: "read:current_user read:users_app_metadata read:user_metadata",
        });
        token = accessToken;
        const metadata = await fetch(`${process.env.REACT_APP_AUTH0_AUDIENCE}users/${user?.sub}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        response = await metadata.json();
      } catch (error) {
        throw error;
      }
    }

    window.sessionStorage.setItem("metadata",JSON.stringify({app_metadata: response.app_metadata, user_metadata: response.user_metadata} as any));
    setUserMetadata(response);

    return token;
  }

  const toggleClose = (callback: (param: boolean)=>void) => {
      return () => callback(false);
  }

  const closeModalFooter = (callback: ()=>void, submit: string = "Submit") => {
    return <div>
              <Button onClick={callback}>Cancel</Button>
              <Modal.Submit>{submit}</Modal.Submit>
          </div>
  }

  const submitCred = async (data: any) => {
    Message.info(<div>This Feture has not been implemted  yet</div>, 8, {
      position: "top-right",
      title: "Customization",
    });
    toggleClose(setShowCred)();
  }

  const submitEdit = async (data: UserEdit) => {
    Message.info(<div>Your changes have been submited</div>, 8, {
      position: "top-right",
      title: "Request Submited",
    });
    toggleClose(setShowEdit)();
    // remove keys that are the same as the current
    Object.keys(data).forEach((value=>{
      if((user as User)[value] && (user as User)[value] === (data as any)[value]){
          delete (data as any)[value];
      } 
    }));
    // move color into user_metadata
    let color = {};
    if(data["color"] !== userMetadata.user_metadata.color){
        (color as any)["user_metadata"] = {};
        (color as any)["user_metadata"]["color"] = data["color"];
        delete (data as any)["color"];
    }else{
      delete (data as any)["color"];
    }

    try {
      const accessToken = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: "update:users update:users_app_metadata update:current_user_metadata",
      });

      if((color as any)?.user_metadata){
        const request_update = await fetch(`${process.env.REACT_APP_AUTH0_AUDIENCE}users/${user?.sub}`,{
          method: "PATCH",
          body: JSON.stringify(color),
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          }
        });
        const request = await request_update.json();
        if (request?.statusCode) {
          throw new Error(request.error);
        }else{
          await fetchUserMetaData(request);
          Message.success(<div>Updated Profile</div>, 8, {
            position: "top-right",
            title: "Updated",
          });
        }
     }

     if(Object.keys(data).length !== 0){
      const update_user = await fetch(`${process.env.REACT_APP_SERVER_SCRIPTS}/user_update.php`,{
        method:"POST",
        body: JSON.stringify({sub: user?.sub, token: accessToken, profile: data})
      });
      const user_update_request = await update_user.json();

      if(user_update_request.type === "info"){
          Message.success(<div>Updated Profile</div>, 8, {
            position: "top-right",
            title: "Updated",
          });
      }else{
       throw new Error(user_update_request.msg);
      }
     }
    } catch (error) {
      Message.error(<div>{error.message}</div>, 8, {
        position: "top-right",
        title: "Error in Request",
      });
    }
  }
  const handleCodeSubmit = async (data: {code: string}) => {
    toggleClose(setShowCode)();
    Message.info(<div>Your code has been submited.</div>, 8, {
      position: "top-right",
      title: "Request Submited",
    });
    try {
      const accessToken = await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: "read:current_user read:users_app_metadata read:user_metadata",
      });
      const code_register = await fetch(`${process.env.REACT_APP_SERVER_SCRIPTS}/register_code.php`,{
        method:"POST",
        body: JSON.stringify({sub: user?.sub, token: accessToken, code: data.code})
      });

      const response = await code_register.json();
     
      if(response?.type === "info"){
        await fetchUserMetaData();
        Message.success(<div>Code Registered</div>, 8, {
          position: "top-right",
          title: "Code",
        });
      }else{
        throw new Error(response.msg);
      }
      
    } catch (error) {
      Message.error(<div>{error.message}</div>, 8, {
        position: "top-right",
        title: "Request",
      });
    }
  }

  useEffect(()=>{
    const getUserMetadata = async () => {
        let raw = window.sessionStorage.getItem("metadata");
        if (raw != null) {
          setUserMetadata(JSON.parse(raw));
          setLoading(false);
        }else{
            try {
                await fetchUserMetaData();
                setLoading(false);
                setUpdate(false);
              } catch (e) {
                setLoading(false);
                console.log(e.message);
              }
        }
      };
      getUserMetadata();
},[update]);
  
  if (!loading){
    if (isAuthenticated){
      return <div id="user-profile">
                  <Modal className="modal-sizing" footer={closeModalFooter(toggleClose(setShowEdit),"Save")} title="Edit Profile" visible={showEdit} onClose={toggleClose(setShowEdit)}>
                    <Form onSubmit={submitEdit}>
                      <Form.Item label="Username">
                          <Input name="name" defaultValue={user?.name}/>
                      </Form.Item>
                      <Form.Item label="Name">
                          <Input name="nickname" defaultValue={user?.nickname}/>
                      </Form.Item>
                      <Form.Item label="Email">
                          <Input name="email" type="email" defaultValue={user?.email}/>
                      </Form.Item>
                      <Form.Item label="Image Url">
                          <Input name="picture" type="url" defaultValue={user?.picture}/>
                      </Form.Item>
                      <Form.Item label="Favorite Colors" tip="select a color">
                        <Radio.Group
                          name="color"
                          keygen={(d: any) => d}
                          data={['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'violet','darkblue']}
                          defaultValue={userMetadata.user_metadata.color}
                        />
                      </Form.Item>
                    </Form>
                  </Modal>
                  <Modal className="modal-sizing" footer={closeModalFooter(toggleClose(setShowCode))} title="Enter Code" visible={showCode} onClose={toggleClose(setShowCode)}>
                    <Form labelWidth={100} labelAlign="right"  style={{ maxWidth: 400 }} onSubmit={handleCodeSubmit}>
                      <Form.Item required label="Code">
                          <Input name="code" placeholder="enter a code"/>
                      </Form.Item>
                    </Form>
                  </Modal>
                  <Modal className="modal-sizing" footer={closeModalFooter(toggleClose(setShowCred))} title="Edit credentials" visible={showCred} onClose={toggleClose(setShowCred)}>
                    <Form labelWidth={100} labelAlign="right"  style={{ maxWidth: 400 }} onSubmit={submitCred}>
                       <Form.Item required label="New password">
                          <Input name="password" placeholder="enter new password" type="password"/>
                       </Form.Item>
                       <Form.Item required label="Reenter password">
                          <Input name="check_password" placeholder="reenter password" type="password"/>
                       </Form.Item>
                    </Form>
                  </Modal>
                  <div id="info">
                      <h1>{user?.name}</h1>
                      <hr/>
                      <p>{user?.email}</p>
                      <div>
                        <p>Color: <span style={{color: userMetadata?.user_metadata?.color ?? "blue"}}>{userMetadata?.user_metadata?.color ?? "blue"}</span></p>
                        <Button.Group size="small" type="primary">
                            <Button onClick={()=>{setShowEdit(true)}}> 
                              <span style={{fontSize: "15px"}} className="material-icons">create</span>
                              Edit
                            </Button>
                            <Button onClick={()=>{setShowCode(true)}}><span style={{fontSize: "15px"}} className="material-icons">build</span>Enter Code</Button>
                            <Button onClick={()=>{setShowCred(true)}}>
                              <span style={{fontSize: "15px"}} className="material-icons">vpn_key</span>
                              Credentials
                            </Button>
                        </Button.Group>
                      </div>
                  </div>
                  <div>
                      <Image src={user?.picture} shape="circle" width={250} height={250}/>
                      <hr/>
                      <code>{user?.sub}</code>
                  </div>
            </div>
    }else{
      return <Redirect to="/login"/>
    }
  }else{
    return <div className="loader">
              <Spin size="54px" name="cube-grid" color="#ff3e00" />
          </div>
  }
};

export default Profile;