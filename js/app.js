// Base API URL - Using local proxy to handle CORS
const API_BASE_URL = '/api/estadisticas_landing';

// Chart color palette
const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4'
];

// Helper function to parse JSON response
async function parseJsonResponse(response) {
    const text = await response.text();
    try {
        // First try parsing as regular JSON
        return JSON.parse(text);
    } catch (e) {
        try {
            // If that fails, try fixing the JSON format
            const fixedText = text.replace(/}{/g, '},{');
            return JSON.parse(`[${fixedText}]`);
        } catch (e2) {
            console.error('Error parsing JSON:', text);
            throw new Error('Invalid JSON response');
        }
    }
}

// Format date string
function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return 'Invalid Date';
    }
}

// Show error message
function showError(elementId, message = 'Error loading data') {
    const container = document.getElementById(elementId).parentElement;
    container.classList.remove('loading');
    container.innerHTML = `<p class="text-gray-500 text-center py-8">Datos temporalmente no disponibles</p>`;
}

// Show no data message
function showNoData(elementId) {
    const container = document.getElementById(elementId).parentElement;
    container.classList.remove('loading');
    container.innerHTML = '<p class="text-gray-500 text-center py-8">No data available</p>';
}

// Create chart function
function createChart(elementId, type, data, options = {}) {
    const container = document.getElementById(elementId).parentElement;
    const ctx = document.getElementById(elementId).getContext('2d');
    container.classList.remove('loading');
    return new Chart(ctx, {
        type,
        data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            ...options
        }
    });
}

// Load all charts
async function loadCharts() {
    // Fetch total visits
    try {
        const response = await fetch(`${API_BASE_URL}/total_visitas`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        document.getElementById('total-visits-count').textContent = data.toLocaleString();
    } catch (error) {
        console.error('Error fetching total visits:', error);
        document.getElementById('total-visits-count').textContent = 'Error loading data';
    }

    // Visits by Day
    try {
        const response = await fetch(`${API_BASE_URL}/visitas_por_dia`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await parseJsonResponse(response);
        
        if (!data || data.length === 0) {
            showNoData('visits-by-day-chart');
            return;
        }

        createChart('visits-by-day-chart', 'line', {
            labels: data.map(item => formatDate(item.dia)),
            datasets: [{
                label: 'Visits',
                data: data.map(item => item.visitas),
                borderColor: colors[0],
                backgroundColor: colors[0] + '20',
                fill: true,
                tension: 0.4
            }]
        }, {
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        });
    } catch (error) {
        console.error('Error loading visits by day:', error);
        showError('visits-by-day-chart');
    }

    // Visits by Country
    try {
        const response = await fetch(`${API_BASE_URL}/visitas_por_pais`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await parseJsonResponse(response);

        if (!data || data.length === 0) {
            showNoData('visits-by-country-chart');
            return;
        }

        createChart('visits-by-country-chart', 'bar', {
            labels: data.map(item => item.pais || 'Unknown'),
            datasets: [{
                label: 'Visits',
                data: data.map(item => item.visitas),
                backgroundColor: colors[1]
            }]
        }, {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        });
    } catch (error) {
        console.error('Error loading visits by country:', error);
        showError('visits-by-country-chart');
    }

    // Visits by Parameter
    try {
        const response = await fetch(`${API_BASE_URL}/visitas_por_parametro`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await parseJsonResponse(response);

        if (!data || data.length === 0) {
            showNoData('visits-by-parameter-chart');
            return;
        }

        createChart('visits-by-parameter-chart', 'pie', {
            labels: data.map(item => item.parametro || 'Unknown'),
            datasets: [{
                data: data.map(item => item.visitas),
                backgroundColor: colors
            }]
        }, {
            plugins: {
                legend: { 
                    position: 'right',
                    labels: { boxWidth: 15 }
                }
            }
        });
    } catch (error) {
        console.error('Error loading visits by parameter:', error);
        showError('visits-by-parameter-chart');
    }

    // Visits by Hour
    try {
        const response = await fetch(`${API_BASE_URL}/visitas_por_hora`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await parseJsonResponse(response);

        if (!data || data.length === 0) {
            showNoData('visits-by-hour-chart');
            return;
        }

        createChart('visits-by-hour-chart', 'line', {
            labels: data.map(item => item.hora ? `${item.hora.split(':')[0]}:00` : 'Unknown'),
            datasets: [{
                label: 'Visits',
                data: data.map(item => item.visitas),
                borderColor: colors[3],
                backgroundColor: colors[3] + '20',
                fill: true,
                tension: 0.4
            }]
        }, {
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        });
    } catch (error) {
        console.error('Error loading visits by hour:', error);
        showError('visits-by-hour-chart');
    }

    // Visits by Device
    try {
        const response = await fetch(`${API_BASE_URL}/visitas_por_dispositivo`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await parseJsonResponse(response);

        if (!data || data.length === 0) {
            showNoData('visits-by-device-chart');
            return;
        }

        createChart('visits-by-device-chart', 'doughnut', {
            labels: data.map(item => item.dispositivo || 'Unknown'),
            datasets: [{
                data: data.map(item => item.visitas),
                backgroundColor: colors
            }]
        }, {
            plugins: {
                legend: { 
                    position: 'right',
                    labels: { boxWidth: 15 }
                }
            }
        });
    } catch (error) {
        console.error('Error loading visits by device:', error);
        showError('visits-by-device-chart');
    }

    // Visits by Status
    try {
        const response = await fetch(`${API_BASE_URL}/visitas_por_estado`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await parseJsonResponse(response);

        if (!data || data.length === 0) {
            showNoData('visits-by-status-chart');
            return;
        }

        createChart('visits-by-status-chart', 'bar', {
            labels: data.map(item => `Status ${item.estado || 'Unknown'}`),
            datasets: [{
                label: 'Visits',
                data: data.map(item => item.cantidad),
                backgroundColor: colors[5]
            }]
        }, {
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        });
    } catch (error) {
        console.error('Error loading visits by status:', error);
        showError('visits-by-status-chart', 'Service temporarily unavailable');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadCharts();

    // Add smooth scrolling for sidebar navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
