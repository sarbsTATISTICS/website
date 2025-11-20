// Plan-specific configuration
const planConfigs = {
    'Essentiel': {
        basePrice: 5000,
        includedTests: 3,
        includedGraphs: 5,
        includedData: 'small',
        features: [
            'Statistiques descriptives',
            '3 tests statistiques inclus',
            '5 graphiques inclus',
            '≤ 1000 observations',
            'Rapport d\'analyse complet'
        ]
    },
    'Avance': {
        basePrice: 9500,
        includedTests: 8,
        includedGraphs: 10,
        includedData: 'medium',
        features: [
            'Statistiques descriptives',
            '8 tests statistiques inclus',
            '10 graphiques inclus',
            '1001 - 5000 observations',
            'Rapport d\'analyse détaillé',
            'Analyses multivariées'
        ]
    },
    'Complet': {
        basePrice: 25000,
        includedTests: 999, // Essentially unlimited
        includedGraphs: 999, // Essentially unlimited
        includedData: 'xlarge',
        features: [
            'Toutes analyses statistiques',
            'Tests statistiques illimités',
            'Graphiques illimités',
            'Jeu de données illimité',
            'Rapport complet et présentation',
            'Support jusqu\'à la soutenance',
            'Révisions illimitées'
        ]
    }
};

// Pricing configuration for extras
const pricingConfig = {
    testPrice: 500,
    graphPrice: 300,
    analysisPrices: {
        descriptive: 0,
        inferential: 500,
        regression: 800,
        multivariate: 1200,
        ml: 2000,
        other: 0
    },
    dataSizePrices: {
        small: 0,
        medium: 1500,
        large: 3000,
        xlarge: 5000
    },
    urgencyPrices: {
        normal: 0,
        urgent: 4000,
        express: 8000
    },
    reportTypePrices: {
        word: 500,
        latex: 0
    },
    presentationPrices: {
        none: 0,
        professional: 2000,
        latex: 1000
    },
    additionalSlidesPrices: {
        0: 0,
        5: 1000,
        10: 2000,
        15: 3000,
        20: 4000
    }
};

// Get URL parameters to determine selected plan
const urlParams = new URLSearchParams(window.location.search);
let selectedPlan = urlParams.get('plan') || 'Essentiel';

// Handle URL encoding for plan names with accents
if (selectedPlan === 'Avanc%C3%A9') {
    selectedPlan = 'Avance'; // Decoded version
}

let currentPlanConfig = planConfigs[selectedPlan];

// If plan is not found, default to Essentiel
if (!currentPlanConfig) {
    selectedPlan = 'Essentiel';
    currentPlanConfig = planConfigs[selectedPlan];
}

// Display names for plans (with proper accents)
const planDisplayNames = {
    'Essentiel': 'Essentiel',
    'Avance': 'Avancé',
    'Complet': 'Complet'
};

// Update plan selection visual state
function updatePlanSelection() {
    document.querySelectorAll('.plan-option').forEach(option => {
        option.classList.remove('selected');
        const radio = option.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
            option.classList.add('selected');
        }
    });
}

// Setup plan selection event listeners
function setupPlanSelection() {
    document.querySelectorAll('.plan-option').forEach(option => {
        option.addEventListener('click', function (e) {
            // Don't trigger if clicking on the radio button itself
            if (e.target.type === 'radio') return;

            const radio = this.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                selectedPlan = radio.value;
                currentPlanConfig = planConfigs[selectedPlan];
                updatePlanSelection();
                updatePlanInformation();
                updatePricing();
            }
        });
    });

    // Also listen for direct radio button changes
    document.querySelectorAll('input[name="selectedPlan"]').forEach(radio => {
        radio.addEventListener('change', function () {
            selectedPlan = this.value;
            currentPlanConfig = planConfigs[selectedPlan];
            updatePlanSelection();
            updatePlanInformation();
            updatePricing();
        });
    });
}

// Update which analyses are included in the plan
function updateAnalysisInclusions() {
    const planConfig = planConfigs[selectedPlan];

    // Reset all checkboxes
    document.querySelectorAll('input[name="analysisType"]').forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = false;
    });

    // Set included analyses based on plan
    if (selectedPlan === 'Essentiel') {
        document.getElementById('analysis_descriptive').checked = true;
        document.getElementById('analysis_descriptive').disabled = true;
    }
    else if (selectedPlan === 'Avance') {
        document.getElementById('analysis_descriptive').checked = true;
        document.getElementById('analysis_multivariate').checked = true;
        document.getElementById('analysis_descriptive').disabled = true;
        document.getElementById('analysis_multivariate').disabled = true;
    }
    else if (selectedPlan === 'Complet') {
        // All analyses are included and mandatory for Complet plan
        document.querySelectorAll('input[name="analysisType"]').forEach(checkbox => {
            checkbox.checked = true;
            checkbox.disabled = true;
        });
    }
}

// Update plan information based on selected plan
function updatePlanInformation() {
    const planConfig = planConfigs[selectedPlan];

    // Update plan name and price with proper display name
    document.getElementById('selected-plan-name').textContent = planDisplayNames[selectedPlan] || selectedPlan;
    document.getElementById('selected-plan-price').textContent = `${planConfig.basePrice} DA`;

    // Update included features
    document.getElementById('included-tests').textContent =
        planConfig.includedTests === 999 ? 'Tests statistiques illimités' : `${planConfig.includedTests} tests statistiques inclus`;

    document.getElementById('included-graphs').textContent =
        planConfig.includedGraphs === 999 ? 'Graphiques illimités' : `${planConfig.includedGraphs} graphiques inclus`;

    document.getElementById('included-data').textContent =
        planConfig.includedData === 'xlarge' ? 'Jeu de données illimité' :
            planConfig.includedData === 'medium' ? '1001 - 5000 observations' : '≤ 1000 observations';

    // Update pricing info text
    document.getElementById('tests-info').textContent =
        planConfig.includedTests === 999 ?
            'Tests illimités inclus dans le plan' :
            `${pricingConfig.testPrice} DA par test au-delà de ${planConfig.includedTests} tests inclus`;

    document.getElementById('graphs-info').textContent =
        planConfig.includedGraphs === 999 ?
            'Graphiques illimités inclus dans le plan' :
            `${pricingConfig.graphPrice} DA par graphique au-delà de ${planConfig.includedGraphs} inclus`;

    // Update base price label
    document.getElementById('base-price-label').textContent = `Plan ${planDisplayNames[selectedPlan] || selectedPlan}:`;

    // Update analysis checkboxes based on plan
    updateAnalysisInclusions();
}

// Get price from pricingConfig instead of data-price attributes
function getPriceFromConfig(elementId, configObject) {
    const element = document.getElementById(elementId);
    if (!element) return 0;

    const value = element.value;
    return configObject[value] || 0;
}

// Update pricing based on user selections
function updatePricing() {
    let total = currentPlanConfig.basePrice;
    let analysisCost = 0;
    let testsCost = 0;
    let graphsCost = 0;
    let dataCost = 0;
    let urgencyCost = 0;
    let reportCost = 0;
    let presentationCost = 0;
    let additionalSlidesCost = 0;

    // Calculate analysis costs
    document.querySelectorAll('input[name="analysisType"]:checked').forEach(checkbox => {
        const analysisType = checkbox.value;
        let price = pricingConfig.analysisPrices[analysisType] || 0;

        // Apply plan-specific pricing rules
        if (selectedPlan === 'Essentiel') {
            // Only descriptive is free, others are charged
            if (analysisType !== 'descriptive') {
                analysisCost += price;
            }
        }
        else if (selectedPlan === 'Avance') {
            // Descriptive and multivariate are free, others are charged
            if (analysisType !== 'descriptive' && analysisType !== 'multivariate') {
                analysisCost += price;
            }
        }
        else if (selectedPlan === 'Complet') {
            // All analyses are free
            analysisCost += 0;
        }
    });

    // Calculate tests cost (only if not unlimited)
    if (currentPlanConfig.includedTests !== 999) {
        const numTests = parseInt(document.getElementById('numTests').value) || 0;
        const includedTests = currentPlanConfig.includedTests;
        if (numTests > includedTests) {
            testsCost = (numTests - includedTests) * pricingConfig.testPrice;
        }
    }

    // Calculate graphs cost (only if not unlimited)
    if (currentPlanConfig.includedGraphs !== 999) {
        const numGraphs = parseInt(document.getElementById('numGraphs').value) || 0;
        const includedGraphs = currentPlanConfig.includedGraphs;
        if (numGraphs > includedGraphs) {
            graphsCost = (numGraphs - includedGraphs) * pricingConfig.graphPrice;
        }
    }

    // Calculate data size cost (only if not unlimited)
    if (currentPlanConfig.includedData !== 'xlarge') {
        const dataSizeSelect = document.getElementById('dataSize');
        const selectedDataSize = dataSizeSelect.value;
        const dataSizePrice = pricingConfig.dataSizePrices[selectedDataSize] || 0;

        // Only charge for data size if it's larger than the included size
        const includedDataSize = currentPlanConfig.includedData;
        const sizeHierarchy = { small: 0, medium: 1, large: 2, xlarge: 3 };

        if (sizeHierarchy[selectedDataSize] > sizeHierarchy[includedDataSize]) {
            dataCost = dataSizePrice;
        } else {
            dataCost = 0; // Free if selected size is smaller or equal to included size
        }
    } else {
        // For Complet plan, set data size to xlarge by default
        document.getElementById('dataSize').value = 'xlarge';
        dataCost = 0; // Free for Complet plan
    }

    // Calculate urgency cost using pricingConfig
    const urgencyValue = document.getElementById('urgency').value;
    urgencyCost = pricingConfig.urgencyPrices[urgencyValue] || 0;

    // Calculate report type cost using pricingConfig
    const reportTypeValue = document.getElementById('reportType').value;
    reportCost = pricingConfig.reportTypePrices[reportTypeValue] || 0;

    // Calculate presentation cost using pricingConfig
    const presentationValue = document.getElementById('presentationType').value;
    presentationCost = pricingConfig.presentationPrices[presentationValue] || 0;

    // Show/hide additional slides based on presentation selection
    const additionalSlidesGroup = document.getElementById('additionalSlidesGroup');
    if (presentationValue === 'none') {
        additionalSlidesGroup.style.display = 'none';
        // Reset additional slides when no presentation is selected
        document.getElementById('additionalSlides').value = '0';
    } else {
        additionalSlidesGroup.style.display = 'block';
    }

    // Calculate additional slides cost using pricingConfig
    const additionalSlidesValue = document.getElementById('additionalSlides').value;
    additionalSlidesCost = pricingConfig.additionalSlidesPrices[additionalSlidesValue] || 0;

    // Calculate total
    total = currentPlanConfig.basePrice + analysisCost + testsCost + graphsCost + dataCost + urgencyCost + reportCost + presentationCost + additionalSlidesCost;

    // Update display
    document.getElementById('base-price').textContent = `${currentPlanConfig.basePrice} DA`;
    document.getElementById('analysis-price').textContent = `${analysisCost} DA`;
    document.getElementById('tests-price').textContent = `${testsCost} DA`;
    document.getElementById('graphs-price').textContent = `${graphsCost} DA`;
    document.getElementById('data-price').textContent = `${dataCost} DA`;
    document.getElementById('urgency-price').textContent = `${urgencyCost} DA`;
    document.getElementById('report-price').textContent = `${reportCost} DA`;
    document.getElementById('presentation-price').textContent = `${presentationCost} DA`;
    document.getElementById('additional-slides-price').textContent = `${additionalSlidesCost} DA`;
    document.getElementById('total-price').textContent = `${total} DA`;

    // Store total for later use
    window.currentTotal = total;
    window.currentPlan = selectedPlan;
}

// Update summary section
function updateSummary() {
    // Personal info
    document.getElementById('summary-name').textContent =
        `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`;
    document.getElementById('summary-email').textContent = document.getElementById('email').value;

    // Project details
    const projectTypeSelect = document.getElementById('projectType');
    const projectTypeText = projectTypeSelect.options[projectTypeSelect.selectedIndex].text;
    document.getElementById('summary-project-type').textContent = projectTypeText;
    document.getElementById('summary-project-title').textContent = document.getElementById('projectTitle').value;
    document.getElementById('summary-research-question').textContent =
        document.getElementById('researchQuestion').value.substring(0, 100) +
        (document.getElementById('researchQuestion').value.length > 100 ? '...' : '');

    // Analysis types
    const analysisTypes = Array.from(document.querySelectorAll('input[name="analysisType"]:checked'))
        .map(cb => {
            const label = document.querySelector(`label[for="${cb.id}"]`).textContent;
            return label;
        })
        .join(', ');
    document.getElementById('summary-analysis-types').textContent = analysisTypes || 'Non spécifié';

    // Software preference
    const softwareSelect = document.getElementById('softwarePreference');
    const softwareText = softwareSelect.value ? softwareSelect.options[softwareSelect.selectedIndex].text : 'Aucune préférence';
    document.getElementById('summary-software').textContent = softwareText;

    // Deadline
    const deadline = document.getElementById('deadline').value;
    if (deadline) {
        const dateObj = new Date(deadline);
        const formattedDate = dateObj.toLocaleDateString('fr-FR');
        document.getElementById('summary-deadline').textContent = formattedDate;
    } else {
        document.getElementById('summary-deadline').textContent = 'Non spécifié';
    }

    // Plan and total price
    document.getElementById('summary-plan').textContent = planDisplayNames[window.currentPlan] || window.currentPlan;
    document.getElementById('summary-total-price').textContent = `${window.currentTotal || currentPlanConfig.basePrice} DA`;
}

// AJAX Form Submission
async function submitFormAJAX() {
    // Update summary before submission
    updateSummary();

    // Show loading state
    const submitBtn = document.getElementById('submit-button');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Envoi en cours...</span>';
    submitBtn.disabled = true;

    try {
        // Prepare form data
        const formData = new FormData();

        // Add all form fields
        const formElements = [
            'firstName', 'lastName', 'email', 'phone', 'institution',
            'projectType', 'projectTitle', 'researchQuestion', 'deadline',
            'supervisorInfo', 'selectedPlan', 'specificTests', 'numTests',
            'numGraphs', 'softwarePreference', 'dataDescription', 'dataSize',
            'urgency', 'additionalRequirements', 'reportType', 'codeDelivery',
            'presentationType', 'additionalSlides'
        ];

        // Add standard form fields
        formElements.forEach(fieldName => {
            const element = document.getElementById(fieldName);
            if (element && element.value) {
                formData.append(fieldName, element.value);
            }
        });

        // Add analysis types
        const analysisTypes = Array.from(document.querySelectorAll('input[name="analysisType"]:checked'))
            .map(cb => cb.value)
            .join(', ');
        if (analysisTypes) {
            formData.append('analysisTypes', analysisTypes);
        }

        // Add Formspree specific fields
        formData.append('_subject', 'Nouvelle demande d\'analyse de données');
        formData.append('_replyto', document.getElementById('email').value);
        formData.append('total_price', window.currentTotal || currentPlanConfig.basePrice);
        formData.append('selected_plan', planDisplayNames[window.currentPlan] || window.currentPlan);
        formData.append('_captcha', 'false');

        console.log('Sending form data to Formspree...');

        // Send via AJAX
        const response = await fetch('https://formspree.io/f/xldzdqeo', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Form submitted successfully');
            
            // Hide the form and show success message
            document.getElementById('analysis-request-form').style.display = 'none';
            document.querySelector('.progress-bar').style.display = 'none';
            document.getElementById('success-message').style.display = 'block';

            // Scroll to top to show success message
            window.scrollTo(0, 0);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('Form submission error:', error);
        alert('Désolé, une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer ou me contacter directement par email à sarb5057@gmail.com');

        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Navigation between steps
function nextStep(currentStep) {
    // Validate current step before proceeding
    if (validateStep(currentStep)) {
        document.getElementById(`step-${currentStep}`).classList.remove('active');
        document.getElementById(`step-${currentStep + 1}`).classList.add('active');

        // Update progress bar
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('completed');
        document.querySelector(`.progress-step[data-step="${currentStep + 1}"]`).classList.add('active');

        // If moving to confirmation step, update summary
        if (currentStep === 3) {
            updateSummary();
        }
    }
}

function prevStep(currentStep) {
    document.getElementById(`step-${currentStep}`).classList.remove('active');
    document.getElementById(`step-${currentStep - 1}`).classList.add('active');

    // Update progress bar
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentStep - 1}"]`).classList.add('active');
}

// Validate form steps
function validateStep(step) {
    let isValid = true;

    if (step === 1) {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;

        if (!firstName || !lastName || !email) {
            alert('Veuillez remplir tous les champs obligatoires');
            isValid = false;
        } else if (!isValidEmail(email)) {
            alert('Veuillez saisir une adresse e-mail valide');
            isValid = false;
        }
    } else if (step === 2) {
        const projectType = document.getElementById('projectType').value;
        const projectTitle = document.getElementById('projectTitle').value;
        const researchQuestion = document.getElementById('researchQuestion').value;

        if (!projectType || !projectTitle || !researchQuestion) {
            alert('Veuillez remplir tous les champs obligatoires');
            isValid = false;
        }
    } else if (step === 3) {
        const analysisTypes = document.querySelectorAll('input[name="analysisType"]:checked');
        if (analysisTypes.length === 0) {
            alert('Veuillez sélectionner au moins un type d\'analyse');
            isValid = false;
        }
    }

    return isValid;
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Redirect to home page
function goHome() {
    window.location.href = 'index.html';
}

// Initialize the form
document.addEventListener('DOMContentLoaded', function () {
    // Set the selected plan in the summary with proper display name
    document.getElementById('summary-plan').textContent = planDisplayNames[selectedPlan] || selectedPlan;

    // Set initial plan selection
    const initialPlanRadio = document.querySelector(`input[name="selectedPlan"][value="${selectedPlan}"]`);
    if (initialPlanRadio) {
        initialPlanRadio.checked = true;
    }

    // Setup plan selection handlers
    setupPlanSelection();
    updatePlanSelection();

    // Update plan information
    updatePlanInformation();

    // Set today as minimum date for deadline
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('deadline').min = today;

    // Add event listeners for checkboxes to update pricing
    document.querySelectorAll('input[name="analysisType"]').forEach(checkbox => {
        checkbox.addEventListener('change', updatePricing);
    });

    // Add event listeners for other form elements that affect pricing
    document.querySelectorAll('#numTests, #numGraphs, #dataSize, #urgency, #reportType, #presentationType, #additionalSlides').forEach(element => {
        element.addEventListener('change', updatePricing);
    });

    // Add event listener for submit button
    document.getElementById('submit-button').addEventListener('click', submitFormAJAX);

    // Initialize pricing
    updatePricing();
});

function printConfirmation() {
    const successMessage = document.getElementById('success-message');
    const printContent = successMessage.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div style="padding: 40px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 24px; font-weight: bold; color: #2d3748;">Confirmation de Demande</div>
                <div style="color: #718096; margin-top: 10px;">${new Date().toLocaleDateString('fr-FR')}</div>
            </div>
            ${printContent}
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    // Re-attach event listeners if needed
    document.getElementById('success-message').style.display = 'block';
}

function goHome() {
    window.location.href = '/'; // Adjust to your home page URL
}