import React, { useState } from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import Avatar from '../assets/icons/avatar.png';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/actions/actionUser';
import { confirmAlert } from 'react-confirm-alert';
import EditProfile from '../views/profile/EditProfile';

const TheHeaderDropdown = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userReducer.user);
  const [modal, setModal] = useState(false);

  const confirmLogout = () => {
    confirmAlert({
      title: 'Konfirmasi Logout',
      message: 'Apakah kamu yakin ingin logout ?',
      buttons: [
        {
          label: 'Yakin',
          onClick: () => {  
            dispatch(logoutUser()); 
            localStorage.removeItem("admin_access_token");
          }
        },
        {
          label: 'Tidak',
          onClick: () => console.log("cancel"),
        }
      ]
    });
  } 

  return (
    <>
      <CDropdown
        inNav
        className="c-header-nav-items mx-2"
        direction="down"
      >
        <CDropdownToggle className="c-header-nav-link" caret={true}>
          <div className="c-avatar">
            <CImg
              src={Avatar}
              className="c-avatar-img"
              alt="adminbprnusa"
            />
          </div>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end"> 
          <CDropdownItem
            header
            tag="div"
            color="light"
            className="text-center"
          >
            <strong>Akun</strong>
          </CDropdownItem>
          <CDropdownItem
            onClick={() => setModal(!modal)}>
            <CIcon name="cil-user" className="mfe-2" />Profile
          </CDropdownItem> 
          <CDropdownItem onClick={confirmLogout}>
            <CIcon name="cil-credit-card" className="mfe-2" /> 
            Logout
          </CDropdownItem> 
        </CDropdownMenu>
      </CDropdown> 
      <EditProfile 
        modal={modal}
        setModal={setModal}
        user={user}
      />
    </>
  )
}

export default TheHeaderDropdown
