import React, { useEffect, useState } from 'react';
import Field from '../components/forms/Field';
import { Link } from 'react-router-dom';
import customersAPI from '../services/customersAPI';

const CustomerPage = ({ match, history }) => {
    const { id = "new" } = match.params;

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    });

    const [editing, setEditing] = useState(false);

    //recup du customer en fonction de l'id
    const fetchCustomer = async id => {
        try {
            const { firstName, lastName, email, company } = await customersAPI.find(id);
            setCustomer({ firstName, lastName, email, company });
        } catch (error) {
            console.log(error.response);
            //
            history.replace("/customers");
        }
    };

    //chargement du customer si besoin au chargement du composant ou au changement de l'id
    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            fetchCustomer(id);
        }
    }, [id]);



    //gestion des chagements des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCustomer({ ...customer, [name]: value })
    };

    //gestion de la soumission du formulaire
    const handleSubmit = async event => {
        event.preventDefault();

        try {
            if (editing) {
                const response = await customersAPI.update(id, customer);
            } else {
                await
                    customersAPI.create(customer);

                history.replace("/customers");
            }
            setErrors({});
        } catch ({ response }) {
            const { violations } = response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                // flash notif
            }
        }

    }

    return (
        <>
            {(!editing && <h1>Création d'un client</h1>) || (
                <h1>Modification d'un client</h1>
            )}
            <form onSubmit={handleSubmit}>
                <Field
                    name="lastName"
                    label="Nom"
                    placeholder="Nom du client"
                    value={customer.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Prénom du client"
                    value={customer.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Adresse email du client"
                    type="email"
                    value={customer.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="company"
                    label="Entreprise"
                    placeholder="Entreprise du client"
                    value={customer.company}
                    onChange={handleChange}
                    error={errors.company}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                    <Link to="/customers" className="btn btn-link">
                        Retour à la liste
                    </Link>
                </div>
            </form>
        </>);
}

export default CustomerPage;