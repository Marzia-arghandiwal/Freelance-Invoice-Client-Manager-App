import { getClients, getInvoices } from './data.js';

// Utility functions
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Dashboard calculations
export function loadDashboardData() {
    const clients = getClients();
    const invoices = getInvoices();
    
    // Calculate totals using array methods
    const totalClients = clients.length;
    const totalInvoices = invoices.length;
    const totalRevenue = invoices.reduce((sum, invoice) => sum + parseFloat(invoice.amount), 0);
    const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;
    const unpaidInvoices = invoices.filter(invoice => invoice.status === 'unpaid').length;
    
    // Update DOM
    document.getElementById('total-clients').textContent = totalClients;
    document.getElementById('total-invoices').textContent = totalInvoices;
    document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue);
    document.getElementById('paid-invoices').textContent = paidInvoices;
    document.getElementById('unpaid-invoices').textContent = unpaidInvoices;
}

// Motivational quotes feature
export async function loadRandomQuote() {
    try {
        const response = await fetch('./data/quotes.json');
        if (!response.ok) {
            throw new Error('Failed to load quotes');
        }
        
        const quotes = await response.json();
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        
        document.getElementById('quote-text').textContent = `"${randomQuote.text}"`;
        document.getElementById('quote-author').textContent = `- ${randomQuote.author || 'Unknown'}`;
    } catch (error) {
        console.error('Error loading quotes:', error);
        document.getElementById('quote-text').textContent = '"The only way to do great work is to love what you do."';
        document.getElementById('quote-author').textContent = '- Steve Jobs';
    }
}

// Form validation
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validateRequired(value) {
    return value && value.trim() !== '';
}

export function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        transition: opacity 0.3s;
        background-color: ${type === 'success' ? '#28a745' : '#dc3545'};
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}