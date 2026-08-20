/**
 * AgBMP Loan Management System Database Service
 * Provides persistent database operations for applications, loans, and organizations.
 */

import initialData from './applications.json';

const STORAGE_KEY_APPS = 'agbmp_db_applications';

export const dbManager = {
  /**
   * Fetch all loan applications from persistent database storage
   */
  getApplications: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_APPS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable, returning in-memory database', e);
    }
    return initialData.applications;
  },

  /**
   * Insert a new loan application into the database
   */
  createApplication: (newApp) => {
    const currentApps = dbManager.getApplications();
    
    // Auto-generate tracking ID e.g. APP-2026-104
    const nextSeq = 100 + currentApps.length + 1;
    const formattedApp = {
      id: newApp.id || `APP-2026-${nextSeq}`,
      applicant: newApp.borrowerName || newApp.applicant,
      lenderOrg: newApp.lenderName || 'Merchants Bank - Cannon Falls',
      projectCategory: newApp.projectCategory || 'Waste Management & Manure Storage',
      county: newApp.county || 'Goodhue',
      requestedAmount: typeof newApp.requestedAmount === 'number' 
        ? `$${newApp.requestedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        : (newApp.requestedAmount.startsWith('$') ? newApp.requestedAmount : `$${newApp.requestedAmount}`),
      amountValue: parseFloat(newApp.requestedAmount.toString().replace(/[^0-9.]/g, '')) || 0,
      estimatedCompletion: newApp.estimatedCompletion || new Date(Date.now() + 90*24*60*60*1000).toISOString().substring(0, 10),
      date: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
      status: 'Submitted'
    };

    const updatedApps = [formattedApp, ...currentApps];

    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(updatedApps));
    } catch (e) {
      console.error('Failed to save to local database storage', e);
    }

    return formattedApp;
  },

  /**
   * Reset database back to default seed data
   */
  resetDatabase: () => {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(initialData.applications));
    } catch (e) {
      console.error('Failed to reset database', e);
    }
    return initialData.applications;
  }
};
