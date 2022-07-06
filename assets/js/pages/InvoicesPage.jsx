import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/invoicesAPI';
import { Link } from 'react-router-dom';


const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
};

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
};

//récupération des invoices auprès de l'api
const InvoicesPage = (props) => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    //nb d'items par page
    const itemsPerPage = 20;

    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll();
            setInvoices(data);
        } catch (error) {
            console.log(error.response);
        }
    };
    //charger les invoices au chargement du composant
    useEffect(() => {
        fetchInvoices();
    }, []);

    //gestion changement de page
    const handlePageChange = (page) => setCurrentPage(page);

    //gestion de la recherche
    const handleSearch = ({ currentTarget }) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    //fonction asynchrone (async)
    // gestion suppression invoices
    const handleDelete = async id => {
        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice => invoice.id !== id));

        try {
            await InvoicesAPI.delete(id);
        } catch (error) {
            setInvoices(originalInvoices);
            // console.log(error.response);
        }
    };


    //filtrage des customers en fonction de la recherche
    const filteredInvoices = invoices.filter(i =>
        i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
        i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        i.amount.toString().includes(search.toLowerCase()) ||
        STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );
    // const formatDate = str => DateTime(str).toFormat('DD MM YYYY')
    //Récupération des données & pagination
    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        currentPage,
        itemsPerPage
    );

    return (
        <>
            <div className='d-flex justify-content-between align-items-center'>
                <h1>Liste des factures</h1>
                <Link className='btn btn-primary' to="/invoices/new">Créer une facture</Link>
            </div>
            <div className='form-group'>
                <input type="text" onChange={handleSearch} value={search} className='form-control' placeholder='Rechercher ...' />
            </div>
            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className='text-center'>Date d'envoi</th>
                        <th className='text-center'>Statut</th>
                        <th className='text-center'>Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map(invoice => <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td>
                            <a href='#'>{invoice.customer.firstName} {invoice.customer.lastName}</a>
                        </td>
                        <td className='text-center'>{new Date(invoice.sentAt).toLocaleDateString()}</td>
                        <td className='text-center'>
                            {/* <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span> */}
                            <p>{STATUS_LABELS[invoice.status]}</p>
                        </td>
                        <td className='text-center'>{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <Link to={"/invoices/" + invoice.id} className='btn btn-sm btn-primary mr-1'>Editer</Link>
                            <button className='btn btn-sm btn-danger' onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                        </td>
                    </tr>)}
                </tbody>
            </table>
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onChangePage={handlePageChange} length={filteredInvoices.length} />
        </>
    );
};

export default InvoicesPage;