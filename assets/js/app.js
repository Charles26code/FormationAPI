// imports importants
// npx webpack --watch --progress == dev-server mais sans passer par le conteneur docker
import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import CustomersPage from './pages/CustomersPage';
import CustomersPagePaginated from './pages/CustomersPagePaginated';
import { HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';
import authAPI from './services/authAPI';
import AuthContext from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';

authAPI.setup();


const App = () => {
    //demander a authAPI si on est connecté : true/false
    const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated());

    const NavbarWithRouter = withRouter(Navbar);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
            <HashRouter>
                <NavbarWithRouter />

                <main className='container pt-5'>
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <PrivateRoute path="/invoices" component={InvoicesPage} />
                        <PrivateRoute path="/customers" component={CustomersPage} />
                        <Route path="/" component={Homepage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>

    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);