import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Customer,
  Lead,
  Opportunity,
  Contact,
  Company,
  Deal,
  Activity,
  Task,
  Campaign,
  Pipeline,
  SalesStage,
  CustomerSegment,
  Interaction,
  CustomerJourney,
  SalesForecast,
  CustomerHealth,
  ChurnRisk,
  CustomerLifetimeValue,
  Referral,
  Upsell,
  CrossSell,
  CustomerFeedback,
  SupportTicket,
  CustomerOnboarding,
  CustomerRetention,
  CustomerAcquisition,
} from '../../types';
import './CustomerCRM.css';

const CustomerCRM: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('customers');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [salesStages, setSalesStages] = useState<SalesStage[]>([]);
  const [customerSegments, setCustomerSegments] = useState<CustomerSegment[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [customerJourneys, setCustomerJourneys] = useState<CustomerJourney[]>([]);
  const [salesForecasts, setSalesForecasts] = useState<SalesForecast[]>([]);
  const [customerHealth, setCustomerHealth] = useState<CustomerHealth[]>([]);
  const [churnRisks, setChurnRisks] = useState<ChurnRisk[]>([]);
  const [customerLifetimeValues, setCustomerLifetimeValues] = useState<CustomerLifetimeValue[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [upsells, setUpsells] = useState<Upsell[]>([]);
  const [crossSells, setCrossSells] = useState<CrossSell[]>([]);
  const [customerFeedbacks, setCustomerFeedbacks] = useState<CustomerFeedback[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [customerOnboardings, setCustomerOnboardings] = useState<CustomerOnboarding[]>([]);
  const [customerRetentions, setCustomerRetentions] = useState<CustomerRetention[]>([]);
  const [customerAcquisitions, setCustomerAcquisitions] = useState<CustomerAcquisition[]>([]);

  useEffect(() => {
    // Simulate fetching data
    setCustomers([
      {
        id: 'customer-1',
        name: 'Acme Corp',
        email: 'contact@acme.com',
        phone: '+1-555-0123',
        company: 'Acme Corporation',
        status: 'active',
        source: 'website',
        value: 50000,
        lastContact: '2024-10-20',
        createdAt: '2024-01-15',
        tags: ['enterprise', 'high-value'],
        notes: 'Large enterprise client with high value potential',
      },
      {
        id: 'customer-2',
        name: 'TechStart Inc',
        email: 'hello@techstart.com',
        phone: '+1-555-0456',
        company: 'TechStart Inc',
        status: 'active',
        source: 'referral',
        value: 25000,
        lastContact: '2024-10-19',
        createdAt: '2024-03-10',
        tags: ['startup', 'growth'],
        notes: 'Fast-growing startup with expansion plans',
      },
    ]);

    setLeads([
      {
        id: 'lead-1',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-555-0789',
        company: 'Smith Industries',
        status: 'new',
        source: 'cold-call',
        score: 85,
        createdAt: '2024-10-21',
        lastActivity: '2024-10-21',
        assignedTo: 'sales-team',
        notes: 'Interested in enterprise plan',
      },
    ]);

    setOpportunities([
      {
        id: 'opp-1',
        name: 'Enterprise Deal',
        customerId: 'customer-1',
        value: 100000,
        stage: 'proposal',
        probability: 75,
        expectedClose: '2024-12-15',
        createdAt: '2024-10-01',
        lastActivity: '2024-10-20',
        assignedTo: 'sales-team',
        customer: 'Acme Corp',
        owner: 'sales-team',
        notes: 'High-value enterprise opportunity',
      },
    ]);

    setContacts([
      {
        id: 'contact-1',
        name: 'Jane Doe',
        email: 'jane@acme.com',
        phone: '+1-555-0321',
        company: 'Acme Corporation',
        title: 'CTO',
        department: 'Engineering',
        lastContact: '2024-10-20',
        createdAt: '2024-02-01',
        tags: ['decision-maker'],
        status: 'active',
        notes: 'Key decision maker for enterprise deals',
      },
    ]);

    setCompanies([
      {
        id: 'company-1',
        name: 'Acme Corporation',
        industry: 'Technology',
        size: 'enterprise',
        revenue: 10000000,
        employees: 500,
        location: 'San Francisco, CA',
        website: 'https://acme.com',
        createdAt: '2024-01-15',
        status: 'active',
        lastActivity: '2024-10-20',
        notes: 'Large enterprise client with complex requirements',
      },
    ]);

    setDeals([
      {
        id: 'deal-1',
        name: 'Q4 Enterprise Contract',
        customerId: 'customer-1',
        value: 150000,
        stage: 'negotiation',
        probability: 80,
        expectedClose: '2024-12-31',
        createdAt: '2024-09-01',
        lastActivity: '2024-10-21',
        assignedTo: 'sales-team',
        customer: 'Acme Corp',
        owner: 'sales-team',
        products: ['Enterprise Plan', 'Support Package'],
        notes: 'High-value enterprise contract with multiple products',
      },
    ]);

    setActivities([
      {
        id: 'activity-1',
        type: 'call',
        subject: 'Product Demo',
        customerId: 'customer-1',
        date: '2024-10-20',
        duration: 30,
        outcome: 'positive',
        notes: 'Customer interested in advanced features',
        assignedTo: 'sales-team',
        createdAt: '2024-10-20',
      },
    ]);

    setTasks([
      {
        id: 'task-1',
        title: 'Follow up on proposal',
        description: 'Send updated pricing to Acme Corp',
        dueDate: '2024-10-25',
        priority: 'high',
        status: 'pending',
        assignedTo: 'sales-team',
        customerId: 'customer-1',
        createdAt: '2024-10-21',
      },
    ]);

    setCampaigns([
      {
        id: 'campaign-1',
        name: 'Q4 Enterprise Push',
        type: 'email',
        status: 'active',
        startDate: '2024-10-01',
        endDate: '2024-12-31',
        budget: 50000,
        targetAudience: 'enterprise',
        metrics: { sent: 1000, opened: 300, clicked: 50, converted: 10 },
        createdAt: '2024-09-15',
      },
    ]);

    setPipelines([
      {
        id: 'pipeline-1',
        name: 'Enterprise Sales',
        stages: ['lead', 'qualified', 'proposal', 'negotiation', 'closed'],
        totalValue: 500000,
        activeDeals: 15,
        createdAt: '2024-01-01',
        status: 'active',
        conversionRate: 0.25,
        averageDealSize: 50000,
        lastUpdated: '2024-10-21',
      },
    ]);

    setSalesStages([
      {
        id: 'stage-1',
        name: 'Lead',
        order: 1,
        probability: 10,
        color: '#3b82f6',
        description: 'Initial contact made',
        createdAt: '2024-01-01',
      },
    ]);

    setCustomerSegments([
      {
        id: 'segment-1',
        name: 'Enterprise',
        description: 'Large companies with high value',
        criteria: { companySize: 'large', revenue: 'high' },
        customerCount: 25,
        averageValue: 75000,
        createdAt: '2024-01-01',
        growthRate: 0.15,
        churnRate: 0.05,
        lastUpdated: '2024-10-21',
      },
    ]);

    setInteractions([
      {
        id: 'interaction-1',
        type: 'email',
        subject: 'Product Update',
        customerId: 'customer-1',
        date: '2024-10-20',
        direction: 'outbound',
        outcome: 'positive',
        notes: 'Customer engaged with content',
        assignedTo: 'marketing-team',
        createdAt: '2024-10-20',
      },
    ]);

    setCustomerJourneys([
      {
        id: 'journey-1',
        customerId: 'customer-1',
        stage: 'onboarding',
        touchpoints: 5,
        duration: 30,
        satisfaction: 8.5,
        nextAction: 'product-training',
        createdAt: '2024-10-01',
        name: 'Enterprise Onboarding',
        stages: ['awareness', 'interest', 'consideration', 'purchase', 'onboarding'],
        averageDuration: 45,
        conversionRate: 0.75,
        lastUpdated: '2024-10-21',
        customerCount: 1,
      },
    ]);

    setSalesForecasts([
      {
        id: 'forecast-1',
        period: 'Q4 2024',
        target: 1000000,
        projected: 850000,
        confidence: 0.85,
        factors: ['market-growth', 'new-products'],
        createdAt: '2024-10-01',
        totalValue: 1000000,
        probability: 0.85,
        deals: 15,
        lastUpdated: '2024-10-21',
      },
    ]);

    setCustomerHealth([
      {
        id: 'health-1',
        customerId: 'customer-1',
        score: 85,
        status: 'healthy',
        factors: ['usage', 'engagement', 'support'],
        lastUpdated: '2024-10-20',
        trends: { usage: 'increasing', engagement: 'medium', support: 'low' },
      },
    ]);

    setChurnRisks([
      {
        id: 'churn-1',
        customerId: 'customer-2',
        risk: 'medium',
        score: 65,
        factors: ['low-usage', 'no-recent-activity'],
        probability: 0.3,
        mitigation: 'increase-engagement',
        lastUpdated: '2024-10-20',
      },
    ]);

    setCustomerLifetimeValues([
      {
        id: 'clv-1',
        customerId: 'customer-1',
        value: 150000,
        period: 'lifetime',
        calculation: 'revenue - costs',
        factors: ['purchase-frequency', 'average-order'],
        lastUpdated: '2024-10-20',
      },
    ]);

    setReferrals([
      {
        id: 'referral-1',
        customerId: 'customer-1',
        referredCustomerId: 'customer-2',
        status: 'converted',
        reward: 1000,
        createdAt: '2024-08-15',
        convertedAt: '2024-09-01',
      },
    ]);

    setUpsells([
      {
        id: 'upsell-1',
        customerId: 'customer-1',
        product: 'Enterprise Plan',
        value: 25000,
        status: 'completed',
        date: '2024-09-15',
        assignedTo: 'sales-team',
      },
    ]);

    setCrossSells([
      {
        id: 'crosssell-1',
        customerId: 'customer-1',
        product: 'Analytics Add-on',
        value: 5000,
        status: 'opportunity',
        date: '2024-10-15',
        assignedTo: 'sales-team',
      },
    ]);

    setCustomerFeedbacks([
      {
        id: 'feedback-1',
        customerId: 'customer-1',
        rating: 9,
        comment: 'Excellent product and support',
        category: 'product',
        status: 'resolved',
        createdAt: '2024-10-18',
        assignedTo: 'product-team',
        customer: 'Acme Corp',
        type: 'satisfaction',
      },
    ]);

    setSupportTickets([
      {
        id: 'ticket-1',
        customerId: 'customer-1',
        subject: 'Integration Issue',
        priority: 'medium',
        status: 'open',
        assignedTo: 'support-team',
        createdAt: '2024-10-21',
        lastUpdated: '2024-10-21',
      },
    ]);

    setCustomerOnboardings([
      {
        id: 'onboarding-1',
        customerId: 'customer-1',
        stage: 'setup',
        progress: 75,
        nextStep: 'training',
        assignedTo: 'customer-success',
        createdAt: '2024-10-01',
        customer: 'Acme Corp',
        startDate: '2024-10-01',
        expectedCompletion: '2024-10-15',
        tasks: [
          { name: 'account-setup', completed: true },
          { name: 'user-training', completed: false },
          { name: 'integration-testing', completed: false },
        ],
      },
    ]);

    setCustomerRetentions([
      {
        id: 'retention-1',
        customerId: 'customer-1',
        strategy: 'proactive-support',
        actions: ['check-in-call', 'feature-demo'],
        success: true,
        createdAt: '2024-10-15',
        customer: 'Acme Corp',
        riskLevel: 'low',
        lastActivity: '2024-10-20',
        engagementScore: 8.5,
        nextAction: 'follow-up-call',
        assignedTo: 'customer-success',
      },
    ]);

    setCustomerAcquisitions([
      {
        id: 'acquisition-1',
        customerId: 'customer-1',
        source: 'website',
        cost: 500,
        channel: 'organic',
        campaign: 'content-marketing',
        createdAt: '2024-01-15',
      },
    ]);
  }, []);

  const renderCustomers = () => (
    <div className="customers-section">
      <h3>Customers ({customers.length})</h3>
      <div className="customer-grid">
        {customers.map(customer => (
          <div key={customer.id} className={`customer-card status-${customer.status}`}>
            <h4>{customer.name}</h4>
            <p className="company">{customer.company}</p>
            <div className="customer-meta">
              <span>Value: ${customer.value.toLocaleString()}</span>
              <span>Source: {customer.source}</span>
              <span>Last Contact: {new Date(customer.lastContact).toLocaleDateString()}</span>
            </div>
            <div className="customer-tags">
              {customer.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <button className="btn btn-small mt-2">View Details</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Add New Customer</button>
    </div>
  );

  const renderLeads = () => (
    <div className="leads-section">
      <h3>Leads ({leads.length})</h3>
      <div className="lead-grid">
        {leads.map(lead => (
          <div key={lead.id} className={`lead-card status-${lead.status}`}>
            <h4>{lead.name}</h4>
            <p className="company">{lead.company}</p>
            <div className="lead-meta">
              <span>Score: {lead.score}</span>
              <span>Source: {lead.source}</span>
              <span>Assigned: {lead.assignedTo}</span>
            </div>
            <p className="notes">{lead.notes}</p>
            <button className="btn btn-small mt-2">Convert to Customer</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Add New Lead</button>
    </div>
  );

  const renderOpportunities = () => (
    <div className="opportunities-section">
      <h3>Opportunities ({opportunities.length})</h3>
      <div className="opportunity-grid">
        {opportunities.map(opp => (
          <div key={opp.id} className={`opportunity-card stage-${opp.stage}`}>
            <h4>{opp.name}</h4>
            <p className="value">Value: ${opp.value.toLocaleString()}</p>
            <div className="opportunity-meta">
              <span>Stage: {opp.stage}</span>
              <span>Probability: {opp.probability}%</span>
              <span>Expected Close: {new Date(opp.expectedClose).toLocaleDateString()}</span>
            </div>
            <button className="btn btn-small mt-2">Update Stage</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Add New Opportunity</button>
    </div>
  );

  const renderContacts = () => (
    <div className="contacts-section">
      <h3>Contacts ({contacts.length})</h3>
      <div className="contact-grid">
        {contacts.map(contact => (
          <div key={contact.id} className="contact-card">
            <h4>{contact.name}</h4>
            <p className="title">
              {contact.title} at {contact.company}
            </p>
            <div className="contact-meta">
              <span>Email: {contact.email}</span>
              <span>Phone: {contact.phone}</span>
              <span>Department: {contact.department}</span>
            </div>
            <div className="contact-tags">
              {contact.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <button className="btn btn-small mt-2">View Details</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Add New Contact</button>
    </div>
  );

  const renderCompanies = () => (
    <div className="companies-section">
      <h3>Companies ({companies.length})</h3>
      <div className="company-grid">
        {companies.map(company => (
          <div key={company.id} className={`company-card status-${company.status}`}>
            <h4>{company.name}</h4>
            <p className="industry">
              {company.industry} • {company.size}
            </p>
            <div className="company-meta">
              <span>Revenue: ${company.revenue.toLocaleString()}</span>
              <span>Employees: {company.employees}</span>
              <span>Location: {company.location}</span>
            </div>
            <button className="btn btn-small mt-2">View Details</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Add New Company</button>
    </div>
  );

  const renderDeals = () => (
    <div className="deals-section">
      <h3>Deals ({deals.length})</h3>
      <div className="deal-grid">
        {deals.map(deal => (
          <div key={deal.id} className={`deal-card stage-${deal.stage}`}>
            <h4>{deal.name}</h4>
            <p className="value">Value: ${deal.value.toLocaleString()}</p>
            <div className="deal-meta">
              <span>Stage: {deal.stage}</span>
              <span>Probability: {deal.probability}%</span>
              <span>Expected Close: {new Date(deal.expectedClose).toLocaleDateString()}</span>
            </div>
            <button className="btn btn-small mt-2">Update Deal</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Add New Deal</button>
    </div>
  );

  const renderActivities = () => (
    <div className="activities-section">
      <h3>Activities ({activities.length})</h3>
      <div className="activity-grid">
        {activities.map(activity => (
          <div key={activity.id} className={`activity-card type-${activity.type}`}>
            <h4>{activity.subject}</h4>
            <p className="type">
              {activity.type} • {activity.duration} min
            </p>
            <div className="activity-meta">
              <span>Date: {new Date(activity.date).toLocaleDateString()}</span>
              <span>Outcome: {activity.outcome}</span>
              <span>Assigned: {activity.assignedTo}</span>
            </div>
            <p className="notes">{activity.notes}</p>
            <button className="btn btn-small mt-2">View Details</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Add New Activity</button>
    </div>
  );

  const renderTasks = () => (
    <div className="tasks-section">
      <h3>Tasks ({tasks.length})</h3>
      <div className="task-grid">
        {tasks.map(task => (
          <div
            key={task.id}
            className={`task-card priority-${task.priority} status-${task.status}`}
          >
            <h4>{task.title}</h4>
            <p className="description">{task.description}</p>
            <div className="task-meta">
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
              <span>Priority: {task.priority}</span>
              <span>Status: {task.status}</span>
            </div>
            <button className="btn btn-small mt-2">Update Task</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Add New Task</button>
    </div>
  );

  const renderCampaigns = () => (
    <div className="campaigns-section">
      <h3>Campaigns ({campaigns.length})</h3>
      <div className="campaign-grid">
        {campaigns.map(campaign => (
          <div key={campaign.id} className={`campaign-card status-${campaign.status}`}>
            <h4>{campaign.name}</h4>
            <p className="type">
              {campaign.type} • Budget: ${campaign.budget.toLocaleString()}
            </p>
            <div className="campaign-meta">
              <span>
                Period: {new Date(campaign.startDate).toLocaleDateString()} -{' '}
                {new Date(campaign.endDate).toLocaleDateString()}
              </span>
              <span>Target: {campaign.targetAudience}</span>
            </div>
            <div className="campaign-metrics">
              <span>Sent: {campaign.metrics.sent}</span>
              <span>Opened: {campaign.metrics.opened}</span>
              <span>Clicked: {campaign.metrics.clicked}</span>
              <span>Converted: {campaign.metrics.converted}</span>
            </div>
            <button className="btn btn-small mt-2">View Campaign</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Create New Campaign</button>
    </div>
  );

  const renderPipelines = () => (
    <div className="pipelines-section">
      <h3>Sales Pipelines ({pipelines.length})</h3>
      <div className="pipeline-grid">
        {pipelines.map(pipeline => (
          <div key={pipeline.id} className={`pipeline-card status-${pipeline.status}`}>
            <h4>{pipeline.name}</h4>
            <p className="stages">Stages: {pipeline.stages.join(' → ')}</p>
            <div className="pipeline-meta">
              <span>Total Value: ${pipeline.totalValue.toLocaleString()}</span>
              <span>Active Deals: {pipeline.activeDeals}</span>
            </div>
            <button className="btn btn-small mt-2">Manage Pipeline</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Create New Pipeline</button>
    </div>
  );

  const renderSalesStages = () => (
    <div className="sales-stages-section">
      <h3>Sales Stages ({salesStages.length})</h3>
      <div className="sales-stage-grid">
        {salesStages.map(stage => (
          <div key={stage.id} className="sales-stage-card">
            <h4>{stage.name}</h4>
            <p className="description">{stage.description}</p>
            <div className="stage-meta">
              <span>Order: {stage.order}</span>
              <span>Probability: {stage.probability}%</span>
              <span style={{ color: stage.color }}>●</span>
            </div>
            <button className="btn btn-small mt-2">Edit Stage</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Add New Stage</button>
    </div>
  );

  const renderCustomerSegments = () => (
    <div className="customer-segments-section">
      <h3>Customer Segments ({customerSegments.length})</h3>
      <div className="customer-segment-grid">
        {customerSegments.map(segment => (
          <div key={segment.id} className="customer-segment-card">
            <h4>{segment.name}</h4>
            <p className="description">{segment.description}</p>
            <div className="segment-meta">
              <span>Customers: {segment.customerCount}</span>
              <span>Avg Value: ${segment.averageValue.toLocaleString()}</span>
            </div>
            <button className="btn btn-small mt-2">View Segment</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Create New Segment</button>
    </div>
  );

  const renderInteractions = () => (
    <div className="interactions-section">
      <h3>Customer Interactions ({interactions.length})</h3>
      <div className="interaction-grid">
        {interactions.map(interaction => (
          <div
            key={interaction.id}
            className={`interaction-card type-${interaction.type} direction-${interaction.direction}`}
          >
            <h4>{interaction.subject}</h4>
            <p className="type">
              {interaction.type} • {interaction.direction}
            </p>
            <div className="interaction-meta">
              <span>Date: {new Date(interaction.date).toLocaleDateString()}</span>
              <span>Outcome: {interaction.outcome}</span>
              <span>Assigned: {interaction.assignedTo}</span>
            </div>
            <p className="notes">{interaction.notes}</p>
            <button className="btn btn-small mt-2">View Details</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Log New Interaction</button>
    </div>
  );

  const renderCustomerJourneys = () => (
    <div className="customer-journeys-section">
      <h3>Customer Journeys ({customerJourneys.length})</h3>
      <div className="customer-journey-grid">
        {customerJourneys.map(journey => (
          <div key={journey.id} className={`customer-journey-card stage-${journey.stage}`}>
            <h4>Journey Stage: {journey.stage}</h4>
            <div className="journey-meta">
              <span>Touchpoints: {journey.touchpoints}</span>
              <span>Duration: {journey.duration} days</span>
              <span>Satisfaction: {journey.satisfaction}/10</span>
            </div>
            <p className="next-action">Next: {journey.nextAction}</p>
            <button className="btn btn-small mt-2">Update Journey</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Create New Journey</button>
    </div>
  );

  const renderSalesForecasts = () => (
    <div className="sales-forecasts-section">
      <h3>Sales Forecasts ({salesForecasts.length})</h3>
      <div className="sales-forecast-grid">
        {salesForecasts.map(forecast => (
          <div key={forecast.id} className="sales-forecast-card">
            <h4>{forecast.period}</h4>
            <div className="forecast-meta">
              <span>Target: ${forecast.target.toLocaleString()}</span>
              <span>Projected: ${forecast.projected.toLocaleString()}</span>
              <span>Confidence: {(forecast.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="forecast-factors">
              <span>Factors: {forecast.factors.join(', ')}</span>
            </div>
            <button className="btn btn-small mt-2">Update Forecast</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Create New Forecast</button>
    </div>
  );

  const renderCustomerHealth = () => (
    <div className="customer-health-section">
      <h3>Customer Health ({customerHealth.length})</h3>
      <div className="customer-health-grid">
        {customerHealth.map(health => (
          <div key={health.id} className={`customer-health-card status-${health.status}`}>
            <h4>Health Score: {health.score}</h4>
            <p className="status">Status: {health.status}</p>
            <div className="health-factors">
              <span>Factors: {health.factors.join(', ')}</span>
            </div>
            <div className="health-trends">
              <span>Usage: {health.trends.usage}</span>
              <span>Engagement: {health.trends.engagement}</span>
              <span>Support: {health.trends.support}</span>
            </div>
            <button className="btn btn-small mt-2">View Health Details</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Analyze Customer Health</button>
    </div>
  );

  const renderChurnRisks = () => (
    <div className="churn-risks-section">
      <h3>Churn Risk Analysis ({churnRisks.length})</h3>
      <div className="churn-risk-grid">
        {churnRisks.map(churn => (
          <div key={churn.id} className={`churn-risk-card risk-${churn.risk}`}>
            <h4>Risk Level: {churn.risk}</h4>
            <p className="score">Score: {churn.score}</p>
            <div className="churn-meta">
              <span>Probability: {(churn.probability * 100).toFixed(0)}%</span>
              <span>Factors: {churn.factors.join(', ')}</span>
            </div>
            <p className="mitigation">Mitigation: {churn.mitigation}</p>
            <button className="btn btn-small mt-2">Take Action</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Run Churn Analysis</button>
    </div>
  );

  const renderCustomerLifetimeValues = () => (
    <div className="customer-lifetime-values-section">
      <h3>Customer Lifetime Values ({customerLifetimeValues.length})</h3>
      <div className="customer-lifetime-value-grid">
        {customerLifetimeValues.map(clv => (
          <div key={clv.id} className="customer-lifetime-value-card">
            <h4>Lifetime Value: ${clv.value.toLocaleString()}</h4>
            <p className="period">{clv.period}</p>
            <div className="clv-meta">
              <span>Calculation: {clv.calculation}</span>
              <span>Factors: {clv.factors.join(', ')}</span>
            </div>
            <button className="btn btn-small mt-2">View CLV Details</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Calculate CLV</button>
    </div>
  );

  const renderReferrals = () => (
    <div className="referrals-section">
      <h3>Referrals ({referrals.length})</h3>
      <div className="referral-grid">
        {referrals.map(referral => (
          <div key={referral.id} className={`referral-card status-${referral.status}`}>
            <h4>Referral Reward: ${referral.reward}</h4>
            <p className="status">Status: {referral.status}</p>
            <div className="referral-meta">
              <span>Created: {new Date(referral.createdAt).toLocaleDateString()}</span>
              <span>
                Converted:{' '}
                {referral.convertedAt
                  ? new Date(referral.convertedAt).toLocaleDateString()
                  : 'Pending'}
              </span>
            </div>
            <button className="btn btn-small mt-2">View Referral</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Track New Referral</button>
    </div>
  );

  const renderUpsells = () => (
    <div className="upsells-section">
      <h3>Upsells ({upsells.length})</h3>
      <div className="upsell-grid">
        {upsells.map(upsell => (
          <div key={upsell.id} className={`upsell-card status-${upsell.status}`}>
            <h4>{upsell.product}</h4>
            <p className="value">Value: ${upsell.value.toLocaleString()}</p>
            <div className="upsell-meta">
              <span>Status: {upsell.status}</span>
              <span>Date: {new Date(upsell.date).toLocaleDateString()}</span>
              <span>Assigned: {upsell.assignedTo}</span>
            </div>
            <button className="btn btn-small mt-2">Update Upsell</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Create Upsell Opportunity</button>
    </div>
  );

  const renderCrossSells = () => (
    <div className="cross-sells-section">
      <h3>Cross-sells ({crossSells.length})</h3>
      <div className="cross-sell-grid">
        {crossSells.map(crossSell => (
          <div key={crossSell.id} className={`cross-sell-card status-${crossSell.status}`}>
            <h4>{crossSell.product}</h4>
            <p className="value">Value: ${crossSell.value.toLocaleString()}</p>
            <div className="cross-sell-meta">
              <span>Status: {crossSell.status}</span>
              <span>Date: {new Date(crossSell.date).toLocaleDateString()}</span>
              <span>Assigned: {crossSell.assignedTo}</span>
            </div>
            <button className="btn btn-small mt-2">Update Cross-sell</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Create Cross-sell Opportunity</button>
    </div>
  );

  const renderCustomerFeedbacks = () => (
    <div className="customer-feedbacks-section">
      <h3>Customer Feedback ({customerFeedbacks.length})</h3>
      <div className="customer-feedback-grid">
        {customerFeedbacks.map(feedback => (
          <div key={feedback.id} className={`customer-feedback-card status-${feedback.status}`}>
            <h4>Rating: {feedback.rating}/10</h4>
            <p className="comment">{feedback.comment}</p>
            <div className="feedback-meta">
              <span>Category: {feedback.category}</span>
              <span>Status: {feedback.status}</span>
              <span>Assigned: {feedback.assignedTo}</span>
            </div>
            <button className="btn btn-small mt-2">Respond to Feedback</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Collect New Feedback</button>
    </div>
  );

  const renderSupportTickets = () => (
    <div className="support-tickets-section">
      <h3>Support Tickets ({supportTickets.length})</h3>
      <div className="support-ticket-grid">
        {supportTickets.map(ticket => (
          <div
            key={ticket.id}
            className={`support-ticket-card priority-${ticket.priority} status-${ticket.status}`}
          >
            <h4>{ticket.subject}</h4>
            <div className="ticket-meta">
              <span>Priority: {ticket.priority}</span>
              <span>Status: {ticket.status}</span>
              <span>Assigned: {ticket.assignedTo}</span>
            </div>
            <div className="ticket-dates">
              <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(ticket.lastUpdated).toLocaleDateString()}</span>
            </div>
            <button className="btn btn-small mt-2">View Ticket</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Create New Ticket</button>
    </div>
  );

  const renderCustomerOnboardings = () => (
    <div className="customer-onboardings-section">
      <h3>Customer Onboarding ({customerOnboardings.length})</h3>
      <div className="customer-onboarding-grid">
        {customerOnboardings.map(onboarding => (
          <div key={onboarding.id} className={`customer-onboarding-card stage-${onboarding.stage}`}>
            <h4>Stage: {onboarding.stage}</h4>
            <p className="progress">Progress: {onboarding.progress}%</p>
            <div className="onboarding-meta">
              <span>Next Step: {onboarding.nextStep}</span>
              <span>Assigned: {onboarding.assignedTo}</span>
            </div>
            <button className="btn btn-small mt-2">Update Onboarding</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Start New Onboarding</button>
    </div>
  );

  const renderCustomerRetentions = () => (
    <div className="customer-retentions-section">
      <h3>Customer Retention ({customerRetentions.length})</h3>
      <div className="customer-retention-grid">
        {customerRetentions.map(retention => (
          <div
            key={retention.id}
            className={`customer-retention-card success-${retention.success}`}
          >
            <h4>Strategy: {retention.strategy}</h4>
            <div className="retention-actions">
              <span>Actions: {retention.actions.join(', ')}</span>
            </div>
            <div className="retention-meta">
              <span>Success: {retention.success ? 'Yes' : 'No'}</span>
              <span>Created: {new Date(retention.createdAt).toLocaleDateString()}</span>
            </div>
            <button className="btn btn-small mt-2">View Retention Plan</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Create Retention Strategy</button>
    </div>
  );

  const renderCustomerAcquisitions = () => (
    <div className="customer-acquisitions-section">
      <h3>Customer Acquisition ({customerAcquisitions.length})</h3>
      <div className="customer-acquisition-grid">
        {customerAcquisitions.map(acquisition => (
          <div key={acquisition.id} className="customer-acquisition-card">
            <h4>Source: {acquisition.source}</h4>
            <p className="cost">Cost: ${acquisition.cost}</p>
            <div className="acquisition-meta">
              <span>Channel: {acquisition.channel}</span>
              <span>Campaign: {acquisition.campaign}</span>
              <span>Created: {new Date(acquisition.createdAt).toLocaleDateString()}</span>
            </div>
            <button className="btn btn-small mt-2">View Acquisition Details</button>
          </div>
        ))}
      </div>
      <button className="btn btn-primary mt-3">Track New Acquisition</button>
    </div>
  );

  return (
    <div className="customer-crm-container">
      <div className="crm-header">
        <div className="crm-header-left">
          <button className="back-button" onClick={() => navigate('/')} title="Back to Dashboard">
            ← Back to Dashboard
          </button>
          <h1>👥 Customer Relationship Management</h1>
        </div>
        <div className="crm-controls">
          <button className="btn btn-primary">+ New Customer</button>
          <button className="btn btn-secondary">Import Data</button>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          Customers
        </button>
        <button
          className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
          onClick={() => setActiveTab('leads')}
        >
          Leads
        </button>
        <button
          className={`tab-btn ${activeTab === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveTab('opportunities')}
        >
          Opportunities
        </button>
        <button
          className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contacts
        </button>
        <button
          className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          Companies
        </button>
        <button
          className={`tab-btn ${activeTab === 'deals' ? 'active' : ''}`}
          onClick={() => setActiveTab('deals')}
        >
          Deals
        </button>
        <button
          className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          Activities
        </button>
        <button
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          className={`tab-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          Campaigns
        </button>
        <button
          className={`tab-btn ${activeTab === 'pipelines' ? 'active' : ''}`}
          onClick={() => setActiveTab('pipelines')}
        >
          Pipelines
        </button>
        <button
          className={`tab-btn ${activeTab === 'sales-stages' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales-stages')}
        >
          Sales Stages
        </button>
        <button
          className={`tab-btn ${activeTab === 'customer-segments' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer-segments')}
        >
          Segments
        </button>
        <button
          className={`tab-btn ${activeTab === 'interactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('interactions')}
        >
          Interactions
        </button>
        <button
          className={`tab-btn ${activeTab === 'customer-journeys' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer-journeys')}
        >
          Journeys
        </button>
        <button
          className={`tab-btn ${activeTab === 'sales-forecasts' ? 'active' : ''}`}
          onClick={() => setActiveTab('sales-forecasts')}
        >
          Forecasts
        </button>
        <button
          className={`tab-btn ${activeTab === 'customer-health' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer-health')}
        >
          Health
        </button>
        <button
          className={`tab-btn ${activeTab === 'churn-risks' ? 'active' : ''}`}
          onClick={() => setActiveTab('churn-risks')}
        >
          Churn Risk
        </button>
        <button
          className={`tab-btn ${activeTab === 'customer-lifetime-values' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer-lifetime-values')}
        >
          CLV
        </button>
        <button
          className={`tab-btn ${activeTab === 'referrals' ? 'active' : ''}`}
          onClick={() => setActiveTab('referrals')}
        >
          Referrals
        </button>
        <button
          className={`tab-btn ${activeTab === 'upsells' ? 'active' : ''}`}
          onClick={() => setActiveTab('upsells')}
        >
          Upsells
        </button>
        <button
          className={`tab-btn ${activeTab === 'cross-sells' ? 'active' : ''}`}
          onClick={() => setActiveTab('cross-sells')}
        >
          Cross-sells
        </button>
        <button
          className={`tab-btn ${activeTab === 'customer-feedbacks' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer-feedbacks')}
        >
          Feedback
        </button>
        <button
          className={`tab-btn ${activeTab === 'support-tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('support-tickets')}
        >
          Support
        </button>
        <button
          className={`tab-btn ${activeTab === 'customer-onboardings' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer-onboardings')}
        >
          Onboarding
        </button>
        <button
          className={`tab-btn ${activeTab === 'customer-retentions' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer-retentions')}
        >
          Retention
        </button>
        <button
          className={`tab-btn ${activeTab === 'customer-acquisitions' ? 'active' : ''}`}
          onClick={() => setActiveTab('customer-acquisitions')}
        >
          Acquisition
        </button>
      </div>

      <div className="crm-content">
        {activeTab === 'customers' && renderCustomers()}
        {activeTab === 'leads' && renderLeads()}
        {activeTab === 'opportunities' && renderOpportunities()}
        {activeTab === 'contacts' && renderContacts()}
        {activeTab === 'companies' && renderCompanies()}
        {activeTab === 'deals' && renderDeals()}
        {activeTab === 'activities' && renderActivities()}
        {activeTab === 'tasks' && renderTasks()}
        {activeTab === 'campaigns' && renderCampaigns()}
        {activeTab === 'pipelines' && renderPipelines()}
        {activeTab === 'sales-stages' && renderSalesStages()}
        {activeTab === 'customer-segments' && renderCustomerSegments()}
        {activeTab === 'interactions' && renderInteractions()}
        {activeTab === 'customer-journeys' && renderCustomerJourneys()}
        {activeTab === 'sales-forecasts' && renderSalesForecasts()}
        {activeTab === 'customer-health' && renderCustomerHealth()}
        {activeTab === 'churn-risks' && renderChurnRisks()}
        {activeTab === 'customer-lifetime-values' && renderCustomerLifetimeValues()}
        {activeTab === 'referrals' && renderReferrals()}
        {activeTab === 'upsells' && renderUpsells()}
        {activeTab === 'cross-sells' && renderCrossSells()}
        {activeTab === 'customer-feedbacks' && renderCustomerFeedbacks()}
        {activeTab === 'support-tickets' && renderSupportTickets()}
        {activeTab === 'customer-onboardings' && renderCustomerOnboardings()}
        {activeTab === 'customer-retentions' && renderCustomerRetentions()}
        {activeTab === 'customer-acquisitions' && renderCustomerAcquisitions()}
      </div>
    </div>
  );
};

export default CustomerCRM;
