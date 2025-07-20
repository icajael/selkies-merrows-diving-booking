// Import Firebase database functions
import { database } from './firebase.js';
import { ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('funnel-form');
    const messageDiv = document.getElementById('form-message');
    const submitBtn = form.querySelector('.submit-btn');

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<span>Submitting...</span>';
        
        // Clear previous messages
        messageDiv.style.display = 'none';
        messageDiv.className = 'form-message';

        try {
            // Collect form data
            const formData = {
                fullName: form.fullName.value.trim(),
                contactNumber: form.contactNumber.value.trim(),
                emailAddress: form.emailAddress.value.trim(),
                selectedDate: form.selectedDate.value,
                facebookLink: form.facebookLink.value.trim(),
                instagramLink: form.instagramLink.value.trim(),
                messageInquiry: form.message.value.trim(),
                submittedAt: new Date().toISOString(),
                timestamp: Date.now()
            };

            // Validate required fields
            const requiredFields = ['fullName', 'contactNumber', 'emailAddress', 'selectedDate'];
            const missingFields = requiredFields.filter(field => !formData[field]);
            
            if (missingFields.length > 0) {
                throw new Error('Please fill in all required fields marked with *');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.emailAddress)) {
                throw new Error('Please enter a valid email address');
            }

            // Validate phone number (basic validation)
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(formData.contactNumber)) {
                throw new Error('Please enter a valid contact number');
            }

            // Validate URLs if provided
            if (formData.facebookLink && !isValidUrl(formData.facebookLink)) {
                throw new Error('Please enter a valid Facebook URL');
            }
            
            if (formData.instagramLink && !isValidUrl(formData.instagramLink)) {
                throw new Error('Please enter a valid Instagram URL');
            }

            // Validate date (must be today or future)
            const selectedDate = new Date(formData.selectedDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                throw new Error('Please select a date that is today or in the future');
            }

            // Save to Firebase Realtime Database
            const inquiriesRef = ref(database, 'inquiries');
            const newInquiryRef = push(inquiriesRef);
            
            await set(newInquiryRef, formData);

            // Show success message
            showMessage('success', 'Thank you! Your inquiry has been submitted successfully. We will contact you soon to confirm your diving adventure!');
            
            // Reset form
            form.reset();
            
            // Optional: Track conversion with analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'engagement',
                    event_label: 'diving_inquiry'
                });
            }

        } catch (error) {
            console.error('Error submitting form:', error);
            showMessage('error', error.message || 'There was an error submitting your inquiry. Please try again or contact us directly.');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = '<span>Submit Inquiry</span>';
        }
    });

    // Helper function to validate URLs
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Helper function to show messages
    function showMessage(type, message) {
        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }

    // Real-time form validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove error styling when user starts typing
            if (this.classList.contains('error')) {
                this.classList.remove('error');
            }
        });
    });

    // Individual field validation
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Check required fields
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        // URL validation
        if (field.type === 'url' && value) {
            if (!isValidUrl(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid URL';
            }
        }

        // Date validation
        if (field.type === 'date' && value) {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                isValid = false;
                errorMessage = 'Please select a date that is today or in the future';
            }
        }

        // Apply validation styling
        if (!isValid) {
            field.classList.add('error');
            showFieldError(field, errorMessage);
        } else {
            field.classList.remove('error');
            hideFieldError(field);
        }

        return isValid;
    }

    // Show field-specific error
    function showFieldError(field, message) {
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.color = '#dc2626';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
    }

    // Hide field-specific error
    function hideFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Set minimum date to today
    const dateInput = document.getElementById('selectedDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
});

// Add error styling to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #dc2626 !important;
        background-color: #fef2f2 !important;
    }
    
    .form-group input.error:focus,
    .form-group textarea.error:focus {
        box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
    }
`;
document.head.appendChild(style);
