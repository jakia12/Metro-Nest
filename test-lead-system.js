/**
 * Lead System Test Script
 * 
 * This file contains sample code to test your lead collection system.
 * You can run these in your browser console or create a test page.
 */

// ============================================
// 1. CREATE A TEST LEAD
// ============================================

async function createTestLead(propertyId) {
  const testLead = {
    name: "Test User",
    email: "test@example.com",
    phone: "555-1234",
    message: "I'm interested in this property. Please contact me.",
    propertyId: propertyId, // Use a real property ID from your database
    source: "Website Form"
  };

  try {
    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testLead)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Lead created successfully:', result.data);
      return result.data;
    } else {
      console.error('❌ Failed to create lead:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error creating lead:', error);
    return null;
  }
}

// Usage:
// createTestLead('YOUR_PROPERTY_ID_HERE');


// ============================================
// 2. FETCH ALL LEADS
// ============================================

async function fetchAllLeads() {
  try {
    const response = await fetch('/api/leads');
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Fetched ${result.count} leads:`, result.data);
      return result.data;
    } else {
      console.error('❌ Failed to fetch leads:', result.error);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching leads:', error);
    return [];
  }
}

// Usage:
// fetchAllLeads();


// ============================================
// 3. FETCH LEADS BY STATUS
// ============================================

async function fetchLeadsByStatus(status) {
  try {
    const response = await fetch(`/api/leads?status=${status}`);
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Fetched ${result.count} ${status} leads:`, result.data);
      return result.data;
    } else {
      console.error('❌ Failed to fetch leads:', result.error);
      return [];
    }
  } catch (error) {
    console.error('❌ Error fetching leads:', error);
    return [];
  }
}

// Usage:
// fetchLeadsByStatus('New');
// fetchLeadsByStatus('Hot');
// fetchLeadsByStatus('Tour Booked');


// ============================================
// 4. UPDATE LEAD STATUS
// ============================================

async function updateLeadStatus(leadId, newStatus) {
  try {
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Lead status updated:', result.data);
      return result.data;
    } else {
      console.error('❌ Failed to update lead:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error updating lead:', error);
    return null;
  }
}

// Usage:
// updateLeadStatus('LEAD_ID_HERE', 'Hot');


// ============================================
// 5. GET LEAD STATISTICS
// ============================================

async function getLeadStatistics() {
  try {
    const response = await fetch('/api/leads');
    const result = await response.json();
    
    if (!result.success) {
      console.error('❌ Failed to fetch leads');
      return null;
    }

    const leads = result.data;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      total: leads.length,
      byStatus: {
        new: leads.filter(l => l.status === 'New').length,
        inFollowUp: leads.filter(l => l.status === 'In Follow-up').length,
        hot: leads.filter(l => l.status === 'Hot').length,
        tourBooked: leads.filter(l => l.status === 'Tour Booked').length,
        closed: leads.filter(l => l.status === 'Closed').length,
        lost: leads.filter(l => l.status === 'Lost').length,
      },
      byTimeframe: {
        last7Days: leads.filter(l => new Date(l.createdAt) >= sevenDaysAgo).length,
        last30Days: leads.filter(l => new Date(l.createdAt) >= thirtyDaysAgo).length,
      },
      bySource: {},
      conversionRate: leads.length > 0 
        ? ((leads.filter(l => l.status === 'Closed').length / leads.length) * 100).toFixed(2) + '%'
        : '0%'
    };

    // Count by source
    leads.forEach(lead => {
      const source = lead.source || 'Unknown';
      stats.bySource[source] = (stats.bySource[source] || 0) + 1;
    });

    console.log('📊 Lead Statistics:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error getting statistics:', error);
    return null;
  }
}

// Usage:
// getLeadStatistics();


// ============================================
// 6. CREATE MULTIPLE TEST LEADS
// ============================================

async function createMultipleTestLeads(propertyId, count = 5) {
  const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'];
  const statuses = ['New', 'In Follow-up', 'Hot', 'Tour Booked'];
  const sources = ['Website Form', 'Instagram', 'Facebook', 'Google Ads', 'Referral'];

  console.log(`Creating ${count} test leads...`);

  for (let i = 0; i < count; i++) {
    const testLead = {
      name: names[i % names.length],
      email: `test${i}@example.com`,
      phone: `555-${1000 + i}`,
      message: `Test message ${i + 1}. I'm interested in this property.`,
      propertyId: propertyId,
      source: sources[i % sources.length],
      status: statuses[i % statuses.length]
    };

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testLead)
      });

      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Lead ${i + 1}/${count} created:`, result.data.name);
      } else {
        console.error(`❌ Failed to create lead ${i + 1}:`, result.error);
      }
    } catch (error) {
      console.error(`❌ Error creating lead ${i + 1}:`, error);
    }

    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('✅ Finished creating test leads');
}

// Usage:
// createMultipleTestLeads('YOUR_PROPERTY_ID_HERE', 5);


// ============================================
// 7. DELETE A LEAD
// ============================================

async function deleteLead(leadId) {
  try {
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Lead deleted successfully');
      return true;
    } else {
      console.error('❌ Failed to delete lead:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error deleting lead:', error);
    return false;
  }
}

// Usage:
// deleteLead('LEAD_ID_HERE');


// ============================================
// 8. COMPREHENSIVE TEST SUITE
// ============================================

async function runComprehensiveTest(propertyId) {
  console.log('🧪 Starting comprehensive lead system test...\n');

  // Test 1: Create a lead
  console.log('Test 1: Creating a test lead...');
  const newLead = await createTestLead(propertyId);
  if (!newLead) {
    console.error('❌ Test 1 failed');
    return;
  }
  console.log('✅ Test 1 passed\n');

  // Test 2: Fetch all leads
  console.log('Test 2: Fetching all leads...');
  const allLeads = await fetchAllLeads();
  if (allLeads.length === 0) {
    console.error('❌ Test 2 failed');
    return;
  }
  console.log('✅ Test 2 passed\n');

  // Test 3: Update lead status
  console.log('Test 3: Updating lead status...');
  const updatedLead = await updateLeadStatus(newLead._id, 'Hot');
  if (!updatedLead || updatedLead.status !== 'Hot') {
    console.error('❌ Test 3 failed');
    return;
  }
  console.log('✅ Test 3 passed\n');

  // Test 4: Fetch by status
  console.log('Test 4: Fetching leads by status...');
  const hotLeads = await fetchLeadsByStatus('Hot');
  if (!hotLeads.some(l => l._id === newLead._id)) {
    console.error('❌ Test 4 failed');
    return;
  }
  console.log('✅ Test 4 passed\n');

  // Test 5: Get statistics
  console.log('Test 5: Getting lead statistics...');
  const stats = await getLeadStatistics();
  if (!stats) {
    console.error('❌ Test 5 failed');
    return;
  }
  console.log('✅ Test 5 passed\n');

  // Test 6: Delete lead
  console.log('Test 6: Deleting test lead...');
  const deleted = await deleteLead(newLead._id);
  if (!deleted) {
    console.error('❌ Test 6 failed');
    return;
  }
  console.log('✅ Test 6 passed\n');

  console.log('🎉 All tests passed! Lead system is working correctly.');
}

// Usage:
// runComprehensiveTest('YOUR_PROPERTY_ID_HERE');


// ============================================
// 9. EXPORT FUNCTIONS FOR USE
// ============================================

// If you want to use these in a module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createTestLead,
    fetchAllLeads,
    fetchLeadsByStatus,
    updateLeadStatus,
    getLeadStatistics,
    createMultipleTestLeads,
    deleteLead,
    runComprehensiveTest
  };
}

// ============================================
// QUICK START GUIDE
// ============================================

console.log(`
╔════════════════════════════════════════════════════════════╗
║         LEAD SYSTEM TEST SCRIPT LOADED                     ║
╚════════════════════════════════════════════════════════════╝

Available Functions:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. createTestLead(propertyId)
   → Create a single test lead

2. fetchAllLeads()
   → Fetch all leads from database

3. fetchLeadsByStatus(status)
   → Fetch leads by status (New, Hot, etc.)

4. updateLeadStatus(leadId, newStatus)
   → Update a lead's status

5. getLeadStatistics()
   → Get comprehensive statistics

6. createMultipleTestLeads(propertyId, count)
   → Create multiple test leads

7. deleteLead(leadId)
   → Delete a specific lead

8. runComprehensiveTest(propertyId)
   → Run all tests automatically

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Quick Start:
1. Get a property ID from your database
2. Run: runComprehensiveTest('YOUR_PROPERTY_ID')
3. Check console for results

Example:
runComprehensiveTest('507f1f77bcf86cd799439011');

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
