// Data storage and management
let clients = JSON.parse(localStorage.getItem('clients')) || [];
let invoices = JSON.parse(localStorage.getItem('invoices')) || [];

// Client functions
export function saveClients() {
    localStorage.setItem('clients', JSON.stringify(clients));
}

export function getClients() {
    return clients;
}

export function addClient(client) {
    const newClient = {
        id: Date.now(),
        ...client,
        createdAt: new Date().toISOString()
    };
    clients.push(newClient);
    saveClients();
    return newClient;
}

export function updateClient(id, updatedClient) {
    const index = clients.findIndex(client => client.id === id);
    if (index !== -1) {
        clients[index] = { ...clients[index], ...updatedClient };
        saveClients();
        return clients[index];
    }
    return null;
}

export function deleteClient(id) {
    const index = clients.findIndex(client => client.id === id);
    if (index !== -1) {
        clients.splice(index, 1);
        saveClients();
        return true;
    }
    return false;
}

export function getClientById(id) {
    return clients.find(client => client.id === id);
}

// Invoice functions
export function saveInvoices() {
    localStorage.setItem('invoices', JSON.stringify(invoices));
}

export function getInvoices() {
    return invoices;
}

export function addInvoice(invoice) {
    const newInvoice = {
        id: Date.now(),
        ...invoice,
        status: 'unpaid',
        createdAt: new Date().toISOString()
    };
    invoices.push(newInvoice);
    saveInvoices();
    return newInvoice;
}

export function updateInvoice(id, updatedInvoice) {
    const index = invoices.findIndex(invoice => invoice.id === id);
    if (index !== -1) {
        invoices[index] = { ...invoices[index], ...updatedInvoice };
        saveInvoices();
        return invoices[index];
    }
    return null;
}

export function deleteInvoice(id) {
    const index = invoices.findIndex(invoice => invoice.id === id);
    if (index !== -1) {
        invoices.splice(index, 1);
        saveInvoices();
        return true;
    }
    return false;
}

export function markInvoiceAsPaid(id) {
    const invoice = invoices.find(inv => inv.id === id);
    if (invoice) {
        invoice.status = 'paid';
        saveInvoices();
        return invoice;
    }
    return null;
}

export function getInvoiceById(id) {
    return invoices.find(invoice => invoice.id === id);
}