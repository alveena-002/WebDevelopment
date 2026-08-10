import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import LayoutHorizontal from '../layout/MainLayout/HorizontalLayout'
import { routes } from './RouteList'

const AppRoutes = (props) => {

    const { match } = props;

    return (
        <Suspense
            fallback={
                <div className="preloader-it">
                    <div className="loader-pendulums" />
                </div>
            }>
            <LayoutHorizontal>
                <Switch>

                    {
                        routes.map((obj, i) => {
                            return (obj.component) ? (
                                <Route
                                    key={i}
                                    exact={obj.exact}
                                    path={match.path + obj.path}
                                    render={matchProps => (
                                        <obj.component {...matchProps} />
                                    )}
                                />) : (null)
                        })
                    }
                    <Route path="*">
                        <Redirect to="/error-404" />
                    </Route>
                </Switch>
            </LayoutHorizontal>
        </Suspense>
    )
}

export default AppRoutes
