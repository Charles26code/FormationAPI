import React, { useEffect, useState, useTransition } from 'react';
import Pagination from '../components/Pagination';
import CustomersAPI from "../services/customersAPI";
import { Link } from 'react-router-dom';
import TableLoader from '../components/loaders/TableLoader';


const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    //permet de récupérer les customers
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);
        } catch (error) {
            console.log(error.response);
        }
    }

    // au chargement du composant on va chercher les customers
    useEffect(() => {
        fetchCustomers()
    }, []);

    //fonction asynchrone (async)
    // gestion suppression customers
    const handleDelete = async id => {
        const originalCustomers = [...customers];

        // optimiste
        setCustomers(customers.filter(customer => customer.id !== id));

        // pessimiste
        try {
            await CustomersAPI.delete(id)
        } catch (error) {
            setCustomers(originalCustomers);
            console.log(error.response);
        }

        // Une facon un peu moche de supprimer des éléments
        // CustomersAPI.delete(id)
        //     .then(response => console.log("ok!"))
        //     .catch(error => {
        //         setCustomers(originalCustomers);
        //         console.log(error.response)
        //     });
    };

    //gestion changement de page
    const handleChangePage = (page) => setCurrentPage(page);

    //gestion de la recherche
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    //nb d'items par page
    const itemsPerPage = 10;

    //filtrage des customers en fonction de la recherche
    const filteredCustomers = customers.filter(c =>
        c.firstName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        (c.company != null && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    //Récupération des données & pagination
    const paginatedCustomers =
        filteredCustomers.length > itemsPerPage
            ? Pagination.getData(filteredCustomers, currentPage, itemsPerPage)
            : filteredCustomers;

    return (<>
        <div className='mb-3 d-flex justify-content-between align-items-center'>
            <h1>Liste des clients</h1>
            <Link to="/customers/new" className='btn btn-primary'>Créer un client</Link>
        </div>

        <div className='form-group'>
            <input type="text" onChange={handleSearch} value={search} className='form-control' placeholder='Rechercher ...' />
        </div>

        <table className='table table-hover'>
            <thead>
                <tr>
                    <th>Id.</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className='text-center'>Factures</th>
                    <th className='text-center'>Montant total</th>
                    <th></th>
                </tr>
            </thead>

            {!loading && (
                <tbody>
                    {paginatedCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <Link to={"/customers/" + customer.id}>{customer.firstName} {customer.lastName}</Link>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className='text-center'>
                                <p>{customer.invoices.length}</p>
                            </td>
                            <td className='text-center'>{customer.totalAmount.toLocaleString()} €</td>
                            <td>
                                <button onClick={() => handleDelete(customer.id)} disabled={customer.invoices.length > 0} className='btn btn-sm btn-danger'>Supprimer</button>
                            </td>
                        </tr>))}
                </tbody>)}
        </table>
        {loading && <TableLoader />}
        {itemsPerPage < filteredCustomers.length && (
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredCustomers.length}
                onChangePage={handleChangePage}
            />
        )}
    </>);
}

export default CustomersPage;