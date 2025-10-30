import { 
    getClients, 
    getInvoices, 
    addInvoice, 
    updateInvoice, 
    deleteInvoice, 
    markInvoiceAsPaid,
    getInvoiceById 
} from './data.js';
import { formatCurrency, formatDate, validateRequired, showNotification } from './utils.js';

// DOM Elements
const invoiceForm = document.getElementById('invoice-form');
const invoicesContainer = document.getElementById('invoices-container');
const clientSelect = document.getElementById('invoice-client');
const cancelBtn = document.getElementById('invoice-cancel-btn');
const formTitle = document.getElementById('invoice-form-title');
const submitBtn = document.getElementById('invoice-submit-btn');

let isEditing = false;
let currentEditId = null;

// Initialize invoices page
document.addEventListener('DOMContentLoaded', () => {
    loadClientsIntoSelect();
    loadInvoices();
    setupEventListeners();
    
    // Set default date to today
    document.getElementById('invoice-date').valueAsDate = new Date();
});

function setupEventListeners() {
    invoiceForm.addEventListener('submit', handleInvoiceSubmit);
    cancelBtn.addEventListener('click', resetForm);
}

function loadClientsIntoSelect() {
    const clients = getClients();
    clientSelect.innerHTML = '<option value="">Select a client</option>' +
        clients.map(client => 
            `<option value="${client.id}">${client.name} (${client.email})</option>`
        ).join('');
}

function handleInvoiceSubmit(e) {
    e.preventDefault();
    
    const formData = {
        clientId: parseInt(document.getElementById('invoice-client').value),
        title: document.getElementById('invoice-title').value.trim(),
        description: document.getElementById('invoice-description').value.trim(),
        amount: parseFloat(document.getElementById('invoice-amount').value),
        date: document.getElementById('invoice-date').value
    };
    
    // Validation
    if (!validateRequired(formData.clientId.toString())) {
        showNotification('Please select a client', 'error');
        return;
    }
    
    if (!validateRequired(formData.title)) {
        showNotification('Service title is required', 'error');
        return;
    }
    
    if (!formData.amount || formData.amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }
    
    if (!validateRequired(formData.date)) {
        showNotification('Date is required', 'error');
        return;
    }
    
    if (isEditing) {
        // Update existing invoice
        const updated = updateInvoice(currentEditId, formData);
        if (updated) {
            showNotification('Invoice updated successfully!');
            resetForm();
            loadInvoices();
        }
    } else {
        // Add new invoice
        const newInvoice = addInvoice(formData);
        showNotification('Invoice created successfully!');
        resetForm();
        loadInvoices();
    }
}

function loadInvoices() {
    const invoices = getInvoices();
    const clients = getClients();
    
    if (invoices.length === 0) {
        invoicesContainer.innerHTML = `
            <div class="empty-state">
                <p>No invoices found. Create your first invoice above!</p>
            </div>
        `;
        return;
    }
    
    invoicesContainer.innerHTML = invoices.map(invoice => {
        const client = clients.find(c => c.id === invoice.clientId);
        const clientName = client ? client.name : 'Unknown Client';
        
        return `
            <div class="invoice-card" data-id="${invoice.id}">
                <div class="invoice-header">
                    <div>
                        <h3 class="invoice-title">${invoice.title}</h3>
                        <p class="client-name">Client: ${clientName}</p>
                    </div>
                    <div class="invoice-actions">
                        <button class="btn-mark-paid" onclick="markAsPaid(${invoice.id})" 
                            ${invoice.status === 'paid' ? 'disabled style="opacity: 0.5;"' : ''}>
                            ${invoice.status === 'paid' ? 'Paid' : 'Mark as Paid'}
                        </button>
                        <button class="btn-edit" onclick="editInvoice(${invoice.id})">Edit</button>
                        <button class="btn-delete" onclick="deleteInvoiceHandler(${invoice.id})">Delete</button>
                    </div>
                </div>
                <div class="invoice-details">
                    <p><strong>Amount:</strong> ${formatCurrency(invoice.amount)}</p>
                    <p><strong>Date:</strong> ${formatDate(invoice.date)}</p>
                    <p><strong>Status:</strong> 
                        <span class="status-${invoice.status}">${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                    </p>
                    ${invoice.description ? `<p><strong>Description:</strong> ${invoice.description}</p>` : ''}
                    <p><strong>Created:</strong> ${formatDate(invoice.createdAt)}</p>
                </div>
            </div>
        `;
    }).join('');
}

function editInvoice(id) {
    const invoice = getInvoiceById(id);
    if (!invoice) return;
    
    isEditing = true;
    currentEditId = id;
    
    // Populate form
    document.getElementById('invoice-id').value = invoice.id;
    document.getElementById('invoice-client').value = invoice.clientId;
    document.getElementById('invoice-title').value = invoice.title;
    document.getElementById('invoice-description').value = invoice.description || '';
    document.getElementById('invoice-amount').value = invoice.amount;
    document.getElementById('invoice-date').value = invoice.date;
    
    // Update UI
    formTitle.textContent = 'Edit Invoice';
    submitBtn.textContent = 'Update Invoice';
    cancelBtn.style.display = 'inline-block';
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

function deleteInvoiceHandler(id) {
    if (confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
        const success = deleteInvoice(id);
        if (success) {
            showNotification('Invoice deleted successfully!');
            loadInvoices();
        }
    }
}

function markAsPaid(id) {
    const updatedInvoice = markInvoiceAsPaid(id);
    if (updatedInvoice) {
        showNotification('Invoice marked as paid!');
        loadInvoices();
    }
}

function resetForm() {
    invoiceForm.reset();
    isEditing = false;
    currentEditId = null;
    
    // Reset UI
    formTitle.textContent = 'Create New Invoice';
    submitBtn.textContent = 'Create Invoice';
    cancelBtn.style.display = 'none';
    document.getElementById('invoice-id').value = '';
    
    // Reset date to today
    document.getElementById('invoice-date').valueAsDate = new Date();
}

// Make functions available globally for onclick handlers
window.editInvoice = editInvoice;
window.deleteInvoiceHandler = deleteInvoiceHandler;
window.markAsPaid = markAsPaid;