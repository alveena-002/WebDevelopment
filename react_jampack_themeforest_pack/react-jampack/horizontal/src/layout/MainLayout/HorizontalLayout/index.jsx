import React, { useEffect } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { toggleCollapsedNav, sidebarDataHover } from '../../../redux/action/Theme';
import PageFooter from '../../Footer/PageFooter';
import TopNav from '../../Header/TopNav';
import { useWindowWidth } from '@react-hook/window-size';
import HorizontalNav from '../../HorizontalNavbar/HorizontalNav';

const LayoutHorizontal = ({ children, navCollapsed, topNavCollapsed, toggleCollapsedNav, sidebarDataHover, dataHover, maximize }) => {


    const appRoutes = useRouteMatch('/apps/');
    const errro404Route = useRouteMatch('/error-404');
    const windowWidth = useWindowWidth();

    useEffect(() => {
        if (windowWidth > 1199) {
            toggleCollapsedNav(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [windowWidth])

    return (
        <div
            className={classNames("hk-wrapper", { "hk-pg-auth": errro404Route }, { "hk__email__backdrop": maximize })}
            data-layout="horizontal"
            data-layout-style={navCollapsed ? "collapsed" : "default"}
            data-navbar-style={topNavCollapsed ? "collapsed" : ""}
            data-menu="light"
            data-footer="simple"
        >
            {/* Top Navbar */}
            <TopNav />
            {/* Vertical Nav */}
            <HorizontalNav />
            <div className="hk-menu-backdrop" onClick={() => toggleCollapsedNav(!navCollapsed)} />
            <div className={classNames("hk-pg-wrapper", { "pb-0": appRoutes })}>
                {children}
                {!appRoutes && <PageFooter />}
            </div>
        </div>
    )
}

const mapStateToProps = ({ theme, emailReducer }) => {
    const { navCollapsed, topNavCollapsed, dataHover } = theme;
    const { maximize } = emailReducer
    return { navCollapsed, topNavCollapsed, dataHover, maximize }
};

export default connect(mapStateToProps, { toggleCollapsedNav, sidebarDataHover })(LayoutHorizontal)
