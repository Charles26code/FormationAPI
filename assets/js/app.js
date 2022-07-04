// imports importants
// npx webpack --watch --progress == dev-server mais sans passer par le conteneur docker
import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import CustomersPage from './pages/CustomersPage';
import { HashRouter, Switch, Route } from "react-router-dom"


// any CSS you import will output into a single css file (app.css in this case)
import './styles/app.css';
import CustomersPagePaginated from './pages/CustomersPagePaginated';
import InvoicesPage from './pages/InvoicesPage';

// start the Stimulus application
console.log("dfghjkl");


const App = () => {
    return (
        <HashRouter>
            <Navbar />

            <main className='container pt-5'>
                <Switch>
                    <Route path="/customers" component={CustomersPage} />
                    <Route path="/invoices" component={InvoicesPage} />
                    <Route path="/" component={Homepage} />
                </Switch>
            </main>
        </HashRouter>
    );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);