import { 
    getClients, 
    addClient, 
    updateClient, 
    deleteClient, 
    getClientById 
} from './data.js';
import { validateEmail, validateRequired, showNotification } from './utils.js';

// DOM Elements
const clientForm = document.getElementById('client-form');
const clientsContainer = document.getElementById('clients-container');
const cancelBtn = document.getElementById('cancel-btn');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');

let isEditing = false;
let currentEditId = null;

// Initialize clients page
document.addEventListener('DOMContentLoaded', () => {
    loadClients();
    setupEventListeners();
});

function setupEventListeners() {
    clientForm.addEventListener('submit', handleClientSubmit);
    cancelBtn.addEventListener('click', resetForm);
}

function handleClientSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('client-name').value.trim(),
        email: document.getElementById('client-email').value.trim(),
        company: document.getElementById('client-company').value.trim(),
        notes: document.getElementById('client-notes').value.trim()
    };
    
    // Validation
    if (!validateRequired(formData.name)) {
        showNotification('Client name is required', 'error');
        return;
    }
    
    if (!validateRequired(formData.email)) {
        showNotification('Client email is required', 'error');
        return;
    }
    
    if (!validateEmail(formData.email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (isEditing) {
        // Update existing client
        const updated = updateClient(currentEditId, formData);
        if (updated) {
            showNotification('Client updated successfully!');
            resetForm();
            loadClients();
        }
    } else {
        // Add new client
        const newClient = addClient(formData);
        showNotification('Client added successfully!');
        resetForm();
        loadClients();
    }
}

function loadClients() {
    const clients = getClients();
    
    if (clients.length === 0) {
        clientsContainer.innerHTML = `
            <div class="empty-state">
                <p>No clients found. Add your first client above!</p>
            </div>
        `;
        return;
    }
    
    clientsContainer.innerHTML = clients.map(client => `
        <div class="client-card" data-id="${client.id}">
            <div class="client-header">
                <h3 class="client-name">${client.name}</h3>
                <div class="client-actions">
                    <button class="btn-edit" onclick="editClient(${client.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteClientHandler(${client.id})">Delete</button>
                </div>
            </div>
            <div class="client-details">
                <p><strong>Email:</strong> ${client.email}</p>
                ${client.company ? `<p><strong>Company:</strong> ${client.company}</p>` : ''}
                ${client.notes ? `<p><strong>Notes:</strong> ${client.notes}</p>` : ''}
                <p><strong>Added:</strong> ${new Date(client.createdAt).toLocaleDateString()}</p>
            </div>
        </div>
    `).join('');
}

function editClient(id) {
    const client = getClientById(id);
    if (!client) return;
    
    isEditing = true;
    currentEditId = id;
    
    // Populate form
    document.getElementById('client-id').value = client.id;
    document.getElementById('client-name').value = client.name;
    document.getElementById('client-email').value = client.email;
    document.getElementById('client-company').value = client.company || '';
    document.getElementById('client-notes').value = client.notes || '';
    
    // Update UI
    formTitle.textContent = 'Edit Client';
    submitBtn.textContent = 'Update Client';
    cancelBtn.style.display = 'inline-block';
    
    // Scroll to form
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

function deleteClientHandler(id) {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
        const success = deleteClient(id);
        if (success) {
            showNotification('Client deleted successfully!');
            loadClients();
        }
    }
}

function resetForm() {
    clientForm.reset();
    isEditing = false;
    currentEditId = null;
    
    // Reset UI
    formTitle.textContent = 'Add New Client';
    submitBtn.textContent = 'Add Client';
    cancelBtn.style.display = 'none';
    document.getElementById('client-id').value = '';
}

// Make functions available globally for onclick handlers
window.editClient = editClient;
window.deleteClientHandler = deleteClientHandler;