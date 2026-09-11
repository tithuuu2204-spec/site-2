export const VERIFICATION_MODE = 'MOCK SANDBOX';

export const verificationService = {
  submitHostApplication(formData) {
    const last4 = formData.aadhaarNumber?.slice(-4) || '1234';
    return {
      applicationId: `app_${Date.now()}`,
      status: 'pending',
      maskedAadhaar: `XXXX-XXXX-${last4}`,
      submittedAt: new Date().toISOString()
    };
  },

  async verifyMockKYC(applicationId) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      verified: true,
      identityVerified: true,
      gstVerified: true,
      completedAt: new Date().toISOString()
    };
  }
};
