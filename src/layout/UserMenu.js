import {Link} from "react-router-dom";
import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faUserCircle,
    faPrint
} from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";

function UserMenu() {
    const firstname = useSelector((state) => state.auth.firstname)
    const lastname = useSelector((state) => state.auth.lastname)
    const roles = useSelector((state) => state.auth.roles)

    return (
        <div className={'d-inline-flex flex-row '}>
            <div>
                <Dropdown
                    title="Dropdown"
                    placeholder={'user-menu'}
                    id="collapsible-nav-dropdown">
                    <Dropdown.Toggle>
                        <FontAwesomeIcon icon={faUserCircle} className={'becs-header-icon'}/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu  id="dropdown-menu-align-end" className={'topbar-dropdown'}>
                        <Dropdown.ItemText>
                            {firstname + ' ' + lastname}
                        </Dropdown.ItemText>
                        <Dropdown.Divider />
                        {
                            (roles.includes('ROLE_PATIENT')) &&
                                <Dropdown.Item as={Link} to="profile">My profile</Dropdown.Item>
                        }
                        {
                            (roles.includes('ROLE_DOCTOR')) &&
                                <Dropdown.Item as={Link} to="doctor">My profile</Dropdown.Item>
                        }
                        {
                            (roles.includes('ROLE_OFFICE')) &&
                            <Dropdown.Item as={Link} to="dental">My dental office</Dropdown.Item>
                        }
                        <Dropdown.Divider />
                        <Dropdown.Item as={Link} to="/logout">Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default UserMenu
