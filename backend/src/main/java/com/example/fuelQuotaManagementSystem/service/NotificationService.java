package com.example.fuelQuotaManagementSystem.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    // Twilio Configuration
    @Value("${twilio.account.sid}")
    private String twilioAccountSid;

    @Value("${twilio.auth.token}")
    private String twilioAuthToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    // Mailgun Configuration
    @Value("${mailgun.api.key:your_mailgun_api_key}")
    private String mailgunApiKey;

    @Value("${mailgun.domain:your_domain.mailgun.org}")
    private String mailgunDomain;

    @Value("${mailgun.from.email:noreply@yourdomain.com}")
    private String mailgunFromEmail;

    // Configuration flags
    @Value("${notification.sms.enabled:false}")
    private boolean smsEnabled;

    @Value("${notification.email.enabled:true}")
    private boolean emailEnabled;

    @Value("${notification.mock.mode:true}")
    private boolean mockMode;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Send SMS notification using Twilio REST API
     */
    public boolean sendSMS(String phoneNumber, String message) {
        if (!smsEnabled) {
            System.out.println("SMS disabled in configuration");
            return false;
        }

        if (mockMode) {
            return sendMockSMS(phoneNumber, message);
        }

        if (!isTwilioConfigured()) {
            System.err.println("Twilio not properly configured");
            return sendEmailAsFallback(phoneNumber, message);
        }

        try {
            // Format phone number for Sri Lanka
            String formattedPhoneNumber = formatSriLankanPhoneNumber(phoneNumber);

            // Twilio API URL
            String url = String.format("https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json", twilioAccountSid);

            // Create headers with Basic Auth
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            String auth = twilioAccountSid + ":" + twilioAuthToken;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);

            // Create request body
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("From", twilioPhoneNumber);
            body.add("To", formattedPhoneNumber);
            body.add("Body", message);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            // Send request
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode() == HttpStatus.CREATED) {
                System.out.println("SMS sent successfully to: " + formattedPhoneNumber);
                return true;
            } else {
                System.err.println("Failed to send SMS. Status: " + response.getStatusCode());
                System.err.println("Response: " + response.getBody());
                return false;
            }

        } catch (Exception e) {
            System.err.println("Error sending SMS: " + e.getMessage());
            e.printStackTrace();
            // Fallback to email if SMS fails
            return sendEmailAsFallback(phoneNumber, message);
        }
    }

    /**
     * Send email notification using Mailgun
     */
    public boolean sendEmail(String email, String subject, String message) {
        if (!emailEnabled) {
            System.out.println("Email disabled in configuration");
            return false;
        }

        if (mockMode) {
            return sendMockEmail(email, subject, message);
        }

        if (!isMailgunConfigured()) {
            System.err.println("Mailgun not properly configured");
            return false;
        }

        try {
            // Mailgun API URL
            String url = String.format("https://api.mailgun.net/v3/%s/messages", mailgunDomain);

            // Create headers with API key
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            String auth = "api:" + mailgunApiKey;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());
            headers.set("Authorization", "Basic " + encodedAuth);

            // Create request body
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("from", "Fuel Quota System <" + mailgunFromEmail + ">");
            body.add("to", email);
            body.add("subject", subject);
            body.add("text", message);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            // Send request
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                System.out.println("Email sent successfully to: " + email);
                return true;
            } else {
                System.err.println("Failed to send email. Status: " + response.getStatusCode());
                System.err.println("Response: " + response.getBody());
                return false;
            }

        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Send fuel transaction notification (Primary method used by controllers)
     */
    public boolean sendFuelTransactionNotification(String phoneNumber, String email,
                                                   String vehicleRegNo, String fuelType,
                                                   double amount, String stationName,
                                                   double remainingQuota, Long transactionId) {

        String smsMessage = createFuelTransactionSMSMessage(vehicleRegNo, fuelType, amount, stationName, remainingQuota, transactionId);
        String emailSubject = "Fuel Transaction Alert - " + vehicleRegNo;
        String emailMessage = createFuelTransactionEmailMessage(vehicleRegNo, fuelType, amount, stationName, remainingQuota, transactionId);

        boolean smsSuccess = false;
        boolean emailSuccess = false;

        // Try SMS first
        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            smsSuccess = sendSMS(phoneNumber, smsMessage);
        }

        // Send email as backup or primary
        if (email != null && !email.trim().isEmpty()) {
            emailSuccess = sendEmail(email, emailSubject, emailMessage);
        }

        return smsSuccess || emailSuccess;
    }

    /**
     * Send quota status notification
     */
    public boolean sendQuotaStatusNotification(String phoneNumber, String email, String vehicleRegNo,
                                               double remainingQuota, double allocatedQuota, String fuelType) {

        double usagePercentage = ((allocatedQuota - remainingQuota) / allocatedQuota) * 100;

        String smsMessage = String.format(
                "Fuel Quota Update: %s has %.1fL %s remaining (%.1f%% used). Plan your fuel usage accordingly.",
                vehicleRegNo, remainingQuota, fuelType, usagePercentage
        );

        String emailSubject = "Fuel Quota Status - " + vehicleRegNo;
        String emailMessage = String.format(
                "Dear Vehicle Owner,\n\n" +
                        "Here's your current fuel quota status:\n\n" +
                        "Vehicle: %s\n" +
                        "Fuel Type: %s\n" +
                        "Allocated Quota: %.1f Liters\n" +
                        "Remaining Quota: %.1f Liters\n" +
                        "Used: %.1f Liters (%.1f%%)\n\n" +
                        "Please plan your fuel usage accordingly.\n\n" +
                        "Thank you,\nFuel Quota Management System",
                vehicleRegNo, fuelType, allocatedQuota, remainingQuota,
                (allocatedQuota - remainingQuota), usagePercentage
        );

        boolean smsSuccess = false;
        boolean emailSuccess = false;

        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            smsSuccess = sendSMS(phoneNumber, smsMessage);
        }

        if (email != null && !email.trim().isEmpty()) {
            emailSuccess = sendEmail(email, emailSubject, emailMessage);
        }

        return smsSuccess || emailSuccess;
    }

    /**
     * Send low quota warning
     */
    public boolean sendLowQuotaWarning(String phoneNumber, String email, String vehicleRegNo,
                                       double remainingQuota, String fuelType, double warningThreshold) {

        String smsMessage = String.format(
                "Low Fuel Quota Alert: %s has only %.1fL %s remaining (below %.1fL threshold). Please refill soon!",
                vehicleRegNo, remainingQuota, fuelType, warningThreshold
        );

        String emailSubject = "Low Fuel Quota Warning - " + vehicleRegNo;
        String emailMessage = String.format(
                "Dear Vehicle Owner,\n\n" +
                        "⚠️ LOW QUOTA WARNING ⚠️\n\n" +
                        "Your fuel quota is running low:\n\n" +
                        "Vehicle: %s\n" +
                        "Fuel Type: %s\n" +
                        "Remaining Quota: %.1f Liters\n" +
                        "Warning Threshold: %.1f Liters\n\n" +
                        "Please visit a fuel station soon to use your remaining quota.\n\n" +
                        "Thank you,\nFuel Quota Management System",
                vehicleRegNo, fuelType, remainingQuota, warningThreshold
        );

        boolean smsSuccess = false;
        boolean emailSuccess = false;

        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            smsSuccess = sendSMS(phoneNumber, smsMessage);
        }

        if (email != null && !email.trim().isEmpty()) {
            emailSuccess = sendEmail(email, emailSubject, emailMessage);
        }

        return smsSuccess || emailSuccess;
    }

    /**
     * Send quota expiry warning
     */
    public boolean sendQuotaExpiryWarning(String phoneNumber, String email, String vehicleRegNo,
                                          double remainingQuota, String expiryDate) {

        String smsMessage = String.format(
                "Fuel Quota Alert: Your %s has %.1fL remaining quota expiring on %s. Please use before expiry.",
                vehicleRegNo, remainingQuota, expiryDate
        );

        String emailSubject = "Fuel Quota Expiry Warning - " + vehicleRegNo;
        String emailMessage = String.format(
                "Dear Vehicle Owner,\n\n" +
                        "This is to inform you that your fuel quota for vehicle %s is expiring soon.\n\n" +
                        "Remaining Quota: %.1f Liters\n" +
                        "Expiry Date: %s\n\n" +
                        "Please ensure to utilize your remaining quota before the expiry date. " +
                        "Unused quota will not be carried forward to the next month.\n\n" +
                        "Thank you,\nFuel Quota Management System",
                vehicleRegNo, remainingQuota, expiryDate
        );

        boolean smsSuccess = sendSMS(phoneNumber, smsMessage);
        boolean emailSuccess = sendEmail(email, emailSubject, emailMessage);

        return smsSuccess || emailSuccess;
    }

    /**
     * Send new monthly quota allocation notification
     */
    public boolean sendNewQuotaAllocationNotification(String phoneNumber, String email,
                                                      String vehicleRegNo, double allocatedQuota,
                                                      String month) {

        String smsMessage = String.format(
                "New Fuel Quota: Your %s has been allocated %.1fL quota for %s. Happy driving!",
                vehicleRegNo, allocatedQuota, month
        );

        String emailSubject = "New Monthly Fuel Quota - " + vehicleRegNo;
        String emailMessage = String.format(
                "Dear Vehicle Owner,\n\n" +
                        "Your new monthly fuel quota has been allocated.\n\n" +
                        "Vehicle: %s\n" +
                        "Allocated Quota: %.1f Liters\n" +
                        "Valid for: %s\n\n" +
                        "You can check your quota status anytime through our portal or mobile app.\n\n" +
                        "Thank you,\nFuel Quota Management System",
                vehicleRegNo, allocatedQuota, month
        );

        boolean smsSuccess = sendSMS(phoneNumber, smsMessage);
        boolean emailSuccess = sendEmail(email, emailSubject, emailMessage);

        return smsSuccess || emailSuccess;
    }

    /**
     * Format Sri Lankan phone numbers for international format
     */
    private String formatSriLankanPhoneNumber(String phoneNumber) {
        if (phoneNumber == null) return null;

        // Remove any spaces, dashes, or parentheses
        String cleaned = phoneNumber.replaceAll("[\\s()-]", "");

        // Handle different Sri Lankan number formats
        if (cleaned.startsWith("0")) {
            // Convert 0771234567 to +94771234567
            return "+94" + cleaned.substring(1);
        } else if (cleaned.startsWith("94")) {
            // Convert 94771234567 to +94771234567
            return "+" + cleaned;
        } else if (cleaned.startsWith("+94")) {
            // Already in correct format
            return cleaned;
        } else if (cleaned.length() == 9) {
            // Assume it's missing the 0, like 771234567
            return "+94" + cleaned;
        }

        return phoneNumber; // Return as-is if we can't format it
    }

    /**
     * Create SMS message for fuel transaction
     */
    private String createFuelTransactionSMSMessage(String vehicleRegNo, String fuelType,
                                                   double amount, String stationName,
                                                   double remainingQuota, Long transactionId) {
        return String.format(
                "Fuel Alert: %.1fL %s pumped at %s for %s. Remaining: %.1fL. Ref: #%d",
                amount, fuelType, stationName, vehicleRegNo, remainingQuota, transactionId
        );
    }

    /**
     * Create email message for fuel transaction
     */
    private String createFuelTransactionEmailMessage(String vehicleRegNo, String fuelType,
                                                     double amount, String stationName,
                                                     double remainingQuota, Long transactionId) {
        return String.format(
                "Dear Vehicle Owner,\n\n" +
                        "This is to confirm your recent fuel transaction:\n\n" +
                        "Vehicle: %s\n" +
                        "Fuel Type: %s\n" +
                        "Amount Pumped: %.1f Liters\n" +
                        "Fuel Station: %s\n" +
                        "Remaining Quota: %.1f Liters\n" +
                        "Transaction Reference: #%d\n" +
                        "Date & Time: %s\n\n" +
                        "If you did not authorize this transaction, please contact us immediately.\n\n" +
                        "Thank you,\nFuel Quota Management System",
                vehicleRegNo, fuelType, amount, stationName, remainingQuota, transactionId,
                java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );
    }

    /**
     * Send email as fallback when SMS fails
     */
    private boolean sendEmailAsFallback(String phoneNumber, String smsMessage) {
        System.out.println("SMS failed, attempting email fallback...");

        String fallbackEmail = "admin@fuelquota.lk";
        String subject = "SMS Delivery Failed - Manual Notification Required";
        String message = String.format(
                "Failed to deliver SMS to: %s\n" +
                        "Original message: %s\n\n" +
                        "Please contact the vehicle owner manually.",
                phoneNumber, smsMessage
        );

        return sendEmail(fallbackEmail, subject, message);
    }

    /**
     * Check if Twilio is properly configured
     */
    private boolean isTwilioConfigured() {
        return twilioAccountSid != null && !twilioAccountSid.trim().isEmpty() &&
                twilioAuthToken != null && !twilioAuthToken.trim().isEmpty() &&
                twilioPhoneNumber != null && !twilioPhoneNumber.trim().isEmpty();
    }

    /**
     * Check if Mailgun is properly configured
     */
    private boolean isMailgunConfigured() {
        return mailgunApiKey != null && !mailgunApiKey.equals("your_mailgun_api_key") &&
                mailgunDomain != null && !mailgunDomain.equals("your_domain.mailgun.org");
    }

    /**
     * Mock SMS for testing/development
     */
    private boolean sendMockSMS(String phoneNumber, String message) {
        System.out.println("=== MOCK SMS ===");
        System.out.println("To: " + phoneNumber);
        System.out.println("Message: " + message);
        System.out.println("SMS sent successfully (MOCK MODE)");
        System.out.println("===============");
        return true;
    }

    /**
     * Mock Email for testing/development
     */
    private boolean sendMockEmail(String email, String subject, String message) {
        System.out.println("=== MOCK EMAIL ===");
        System.out.println("To: " + email);
        System.out.println("Subject: " + subject);
        System.out.println("Message: " + message);
        System.out.println("Email sent successfully (MOCK MODE)");
        System.out.println("==================");
        return true;
    }

    /**
     * Test notification service configuration
     */
    public Map<String, Object> testConfiguration() {
        Map<String, Object> config = new HashMap<>();
        config.put("smsEnabled", smsEnabled);
        config.put("emailEnabled", emailEnabled);
        config.put("mockMode", mockMode);
        config.put("twilioConfigured", isTwilioConfigured());
        config.put("mailgunConfigured", isMailgunConfigured());

        return config;
    }

    /**
     * Test SMS sending
     */
    public boolean testSMS(String phoneNumber) {
        String testMessage = "Test SMS from Fuel Quota Management System. Your SMS configuration is working!";
        return sendSMS(phoneNumber, testMessage);
    }

    /**
     * Test Email sending
     */
    public boolean testEmail(String email) {
        String subject = "Test Email - Fuel Quota Management System";
        String message = "This is a test email to verify your email configuration is working correctly.\n\nThank you,\nFuel Quota Management System";
        return sendEmail(email, subject, message);
    }
}