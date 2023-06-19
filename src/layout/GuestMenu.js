import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCircleUser
} from '@fortawesome/free-solid-svg-icons';
import {Dropdown} from "react-bootstrap";
import {Link} from "react-router-dom";

const GuestMenu = () => {
    return (
        <div className={'d-inline-flex flex-row'}>
            <div>
                <Dropdown
                    title="Guest menu"
                    placeholder={'dew'}
                    id="collapsible-nav-dropdown">
                    <Dropdown.Toggle  className={'bg-transparent border-0'} >
                        <FontAwesomeIcon icon={faCircleUser}/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/register">Register</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/login">Sign-in</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    )
}

export default GuestMenu;
