import { Notification, User } from "@carbon/icons-react";
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderMenuItem, HeaderName, HeaderNavigation, SkipToContent } from "carbon-components-react";

import './NavBar.scss'
import React from "react";

class NavBar extends React.Component {
    render() {
        return (
            <Header aria-label="navbar" className="NavBar">
                <HeaderName href="/" prefix="Phi">Judge</HeaderName>
                <SkipToContent />

                <HeaderNavigation>
                    <HeaderMenuItem href="/">Home</HeaderMenuItem>
                    <HeaderMenuItem href="#">Problem Set</HeaderMenuItem>
                    <HeaderMenuItem href="#">Submits</HeaderMenuItem>
                </HeaderNavigation>

                <HeaderGlobalBar>
                    <HeaderGlobalAction aria-label="Notifications">
                        <Notification size={20} />
                    </HeaderGlobalAction>
                    <HeaderGlobalAction aria-label="User" href="/auth/signin">
                        <User size={20} />
                    </HeaderGlobalAction>
                </HeaderGlobalBar>
            </Header>
        )
    }
}

export default NavBar;
