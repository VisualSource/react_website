import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {Button,Spin, Image, Modal, Form, Input, Message, Radio} from 'shineout';
import {Link, Redirect} from 'react-router-dom';
import CONFIG from '../config.json';

const CodeRules = {
  code: [
    { required: true, message: 'Please enter code.' },
    { min: 25, message: 'Code must be at least {min} characters.' },
    { regExp: /[a-z]+/i, message: 'Password at least has one letter.' },
  ]
}

const Profile = () => {
  const { user, isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const [userMetadata, setUserMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit,setShowEdit] = useState(false);
  const [showCode,setShowCode] = useState(false);
  const [showCred,setShowCred] = useState(false);
  const [update,setUpdate] = useState(true);

  const credClose = () => {
    setShowCred(false);
  }
  const renderCredFooter = () =>{
    return <div>
              <Button onClick={credClose}>Cancel</Button>
              {
                //@ts-ignore
                <Modal.Submit>Submit</Modal.Submit>
              }
           </div>
  }
  const submitCred = async (data: any) => {
    Message.info(<div>This Feture has not been implemted  yet</div>, 20, {
      position: "top-right",
      title: "Customization",
    });
    credClose();
  }


  const editClose = () => {
    setShowEdit(false);
  }
  const renderEditFooter = () =>{
    return <div>
              <Button onClick={editClose}>Cancel</Button>
              {
                //@ts-ignore
                <Modal.Submit>Submit</Modal.Submit>
              }
           </div>
  }
  const submitEdit = async (data: any) => {
    Message.info(<div>Your changes have been submited</div>, 20, {
      position: "top-right",
      title: "Request Submited",
    });
    editClose();
    try {
      
      const accessToken = await getAccessTokenSilently({
        audience: CONFIG.auth.audience,
        scope: "update:connection update:users update:current_user update:users_app_metadata",
      });

      const request_update = await fetch(`${CONFIG.auth.audience}users/${user.sub}`,{
        method: "PATCH",
        body: JSON.stringify({user_metadata: {color: data.color}}),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
      });

      const request = await request_update.json();
      if (request?.statusCode) {
        Message.error(<div>{request.error}</div>, 20, {
          position: "top-right",
          title: "Error in Request",
        });
      }else{
        window.sessionStorage.setItem("metadata",JSON.stringify({user_metadata: request.user_metadata, app_metadata: request.app_metadata}));
        setUserMetadata({user_metadata: request.user_metadata, app_metadata: request.app_metadata});
        Message.success(<div>Updated Profile</div>, 20, {
          position: "top-right",
          title: "Updated",
        });
      }
      
      
    } catch (error) {
      Message.error(<div>{error.message}</div>, 20, {
        position: "top-right",
        title: "Error in Request",
      });
    }
  }


  const codeClose = () => {
    setShowCode(false);
  }
  const handleCodeSubmit = async (data: any) => {
    codeClose();
    Message.info(<div>Your code has been submited.</div>, 20, {
      position: "top-right",
      title: "Request Submited",
    });
    try {
      const accessToken = await getAccessTokenSilently({
        audience: CONFIG.auth.audience,
        scope: "update:users update:users_app_metadata update:current_user_metadata",
      });
      const request = await fetch(`${CONFIG.scipts}register_code.php`,{
        method:"POST",
        body: JSON.stringify({ code: data.code, sub: user.sub, token: accessToken })
      });
      const response = await request.json();
      console.log(response);
      
      if (response.code === 200) {
        Message.success(<div>Your code has been registered</div>, 20, {
          position: "top-right",
          title: "Register success",
        });
      }else{
        throw new Error("Failed to register code.");
      }
    } catch (error) {
      Message.error(<div>There was an error</div>, 20, {
        position: "top-right",
        title: "Request",
      });
    }

  }
  const renderCodeFooter = () =>{
    return <div>
              <Button onClick={codeClose}>Cancel</Button>
              {
                //@ts-ignore
                <Modal.Submit>Submit</Modal.Submit>
              }
           </div>
  }

  useEffect(()=>{
    const getUserMetadata = async () => {
        let raw = window.sessionStorage.getItem("metadata");
        if (raw != null) {
          setUserMetadata(JSON.parse(raw));
          setLoading(false);
        }else{
            try {
                const accessToken = await getAccessTokenSilently({
                  audience: CONFIG.auth.audience,
                  scope: "read:current_user read:users_app_metadata read:user_metadata",
                });
          
                const userDetailsByIdUrl = `${CONFIG.auth.audience}users/${user.sub}`;
          
                const metadataResponse = await fetch(userDetailsByIdUrl, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                });
                const all = await metadataResponse.json();
                window.sessionStorage.setItem("metadata",JSON.stringify({app_metadata: all.app_metadata, user_metadata: all.user_metadata} as any));
                setUserMetadata(all);
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
                  <Modal className="modal-sizing" footer={renderEditFooter()} title="Edit Profile" visible={showEdit} onClose={editClose}>
                    <Form onSubmit={submitEdit}>
                      <Form.Item label="Name">
                          <Input name="name" defaultValue={user.name}/>
                      </Form.Item>
                      <Form.Item label="Nickname">
                          <Input name="nickname" defaultValue={user.nickname}/>
                      </Form.Item>
                      <Form.Item label="Email">
                          <Input name="email" type="email" defaultValue={user.email}/>
                      </Form.Item>
                      <Form.Item label="Image Url">
                          <Input name="picture" type="url" defaultValue={user.picture}/>
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
                  <Modal className="modal-sizing" footer={renderCodeFooter()} title="Enter Code" visible={showCode} onClose={codeClose}>
                    <Form labelWidth={100} rules={CodeRules} labelAlign="right"  style={{ maxWidth: 400 }} onSubmit={handleCodeSubmit}>
                       <Form.Item required label="Code">
                          <Input name="code" placeholder="enter a code" type="password"/>
                       </Form.Item>
                    </Form>
                  </Modal>
                  <Modal className="modal-sizing" footer={renderCredFooter()} title="Edit credentials" visible={showCred} onClose={credClose}>
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
                      <h1>{user.name}</h1>
                      <hr/>
                      <p>{user.email}</p>
                      <div>
                        <p>Color: <span style={{color: userMetadata?.user_metadata?.color ?? "blue"}}>{userMetadata?.user_metadata?.color ?? "blue"}</span></p>
                        <Button.Group size="small" type="primary">
                            <Button onClick={()=>{setShowEdit(true)}}> 
                              <span style={{fontSize: "15px"}} className="material-icons">create</span>
                              Edit
                            </Button>
                           {
                             // <Button onClick={()=>{setShowCode(true)}}><span style={{fontSize: "15px"}} className="material-icons">build</span>Enter Code</Button>
                           }
                            <Button onClick={()=>{setShowCred(true)}}>
                              <span style={{fontSize: "15px"}} className="material-icons">vpn_key</span>
                              Credentials
                            </Button>
                        </Button.Group>
                      </div>
                  </div>
                  <div>
                      <Image src={user.picture} shape="circle" width={250} height={250}/>
                      <hr/>
                      <code>{user.sub}</code>
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