import ApiService from './ApiService';

// Twilio Configuration
const TWILIO_CONFIG = {
  accountSid: 'AC590afe33af892bb8ed5767f52aabd360',
  authToken: '2a50528de33f4a8137034bb4c6018ceb',
  fromNumber: '+13412184757',
};

const SMSService = {
  sendSMS: async (toNumber, message) => {
    try {
      // First try to send via backend API
      const response = await ApiService.sendSMS(toNumber, message);
      
      if (response.success) {
        return {
          success: true,
          messageId: response.messageId,
          message: 'SMS sent successfully',
        };
      } else {
        throw new Error(response.message || 'Failed to send SMS');
      }
    } catch (error) {
      console.error('SMS sending error:', error);
      
      // Fallback: Try direct Twilio API call
      try {
        return await this.sendViaTwilio(toNumber, message);
      } catch (twilioError) {
        console.error('Twilio SMS error:', twilioError);
        throw new Error('Failed to send SMS notification');
      }
    }
  },

  sendViaTwilio: async (toNumber, message) => {
    try {
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_CONFIG.accountSid}/Messages.json`;
      
      const formData = new FormData();
      formData.append('From', TWILIO_CONFIG.fromNumber);
      formData.append('To', toNumber);
      formData.append('Body', message);

      const response = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`),
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          messageId: data.sid,
          message: 'SMS sent successfully via Twilio',
        };
      } else {
        throw new Error('Twilio API error');
      }
    } catch (error) {
      console.error('Direct Twilio SMS error:', error);
      throw error;
    }
  },

  // Format SMS message for fuel transaction
  formatTransactionSMS: (transactionData) => {
    return `🚗 Fuel Transaction Alert!
    
Vehicle: ${transactionData.vehicleNumber}
Fuel Dispensed: ${transactionData.liters}L
Amount Paid: Rs. ${transactionData.totalAmount}
Remaining Quota: ${transactionData.remainingQuota}L
Date & Time: ${new Date(transactionData.timestamp).toLocaleString()}

Thank you for using our fuel station!`;
  },

  // Validate phone number format
  validatePhoneNumber: (phoneNumber) => {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it's a valid Sri Lankan mobile number
    const sriLankanMobileRegex = /^94[0-9]{9}$|^0[0-9]{9}$/;
    
    if (sriLankanMobileRegex.test(cleaned)) {
      // Convert to international format
      if (cleaned.startsWith('0')) {
        return '+94' + cleaned.substring(1);
      } else if (cleaned.startsWith('94')) {
        return '+' + cleaned;
      }
    }
    
    // If not Sri Lankan format, assume it's already in international format
    if (cleaned.length >= 10 && cleaned.length <= 15) {
      return '+' + cleaned;
    }
    
    throw new Error('Invalid phone number format');
  },

  // Test SMS functionality
  sendTestSMS: async (toNumber) => {
    try {
      const validatedNumber = this.validatePhoneNumber(toNumber);
      const testMessage = 'Test message from Fuel Station App. SMS functionality is working correctly!';
      
      return await this.sendSMS(validatedNumber, testMessage);
    } catch (error) {
      console.error('Test SMS error:', error);
      throw error;
    }
  },
};

export default SMSService;
