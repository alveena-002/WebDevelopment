import React, { useState, useEffect } from 'react';
import {
  Property,
  BuyerProfile,
  Landlord,
  FinancialStatement,
  MaintenanceTicket,
  TenancyAlert,
  OfferNegotiation,
  SyndicationLog,
  GMBAgencyProfile
} from './types';
import { Navbar, ActiveTab } from './components/Navbar';
import { PropertyCatalog } from './components/PropertyCatalog';
import { PropertyFormModal } from './components/PropertyFormModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { SyndicationHub } from './components/SyndicationHub';
import { AIMatcherDashboard } from './components/AIMatcherDashboard';
import { VirtualTourViewer } from './components/VirtualTourViewer';
import { LandlordPortal } from './components/LandlordPortal';
import { OfferTracker } from './components/OfferTracker';
import { GMBSearchPortal } from './components/GMBSearchPortal';
import { CheckCircle2, Sparkles, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('properties');
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [properties, setProperties] = useState<Property[]>([]);
  const [buyers, setBuyers] = useState<BuyerProfile[]>([]);
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [statements, setStatements] = useState<FinancialStatement[]>([]);
  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>([]);
  const [tenancyAlerts, setTenancyAlerts] = useState<TenancyAlert[]>([]);
  const [offers, setOffers] = useState<OfferNegotiation[]>([]);
  const [syndicationLogs, setSyndicationLogs] = useState<SyndicationLog[]>([]);
  const [agencyProfile, setAgencyProfile] = useState<GMBAgencyProfile>({
    agencyName: 'PropLens Premier Estates & Lettings',
    tagline: 'London & UK Regional Luxury Property Specialists',
    branchCity: 'Knightsbridge & Central London',
    address: '102 Brompton Road, Knightsbridge, London SW3 1JJ',
    phone: '+44 20 7584 9000',
    rating: 4.9,
    reviewCount: 142,
    gmbUrl: 'https://maps.google.com/?cid=proplens_knightsbridge_agency',
    customDomain: 'proplens.co.uk/agencies/premier-london',
    seoMetaTitle: 'Premier Estate & Letting Agents Knightsbridge & Kensington | PropLens',
    seoMetaDescription: 'Search luxury homes for sale and let in Knightsbridge, Kensington, Manchester & Bristol. Instant 360 virtual tours, direct landlord reports, and verified buyer matching.',
    neighborhoodHighlights: [
      'Walking distance to Hyde Park, Harrods & V&A Museum',
      'Outstanding OFSTED rated state & independent schools'
    ]
  });

  // Modal / Selection states
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [selectedDetailProperty, setSelectedDetailProperty] = useState<Property | null>(null);
  const [focusTourProperty, setFocusTourProperty] = useState<Property | null>(null);
  const [focusAiPropertyId, setFocusAiPropertyId] = useState<string>('');

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch initial data from Express backend
  const loadInitialData = async () => {
    try {
      const [propRes, buyRes, logsRes, offRes, landRes, stmtRes, maintRes, tenRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/buyers'),
        fetch('/api/syndication-logs'),
        fetch('/api/offers'),
        fetch('/api/landlords'),
        fetch('/api/financials'),
        fetch('/api/maintenance'),
        fetch('/api/tenancies')
      ]);

      if (propRes.ok) setProperties(await propRes.json());
      if (buyRes.ok) setBuyers(await buyRes.json());
      if (logsRes.ok) setSyndicationLogs(await logsRes.json());
      if (offRes.ok) setOffers(await offRes.json());
      if (landRes.ok) setLandlords(await landRes.json());
      if (stmtRes.ok) setStatements(await stmtRes.json());
      if (maintRes.ok) setMaintenanceTickets(await maintRes.json());
      if (tenRes.ok) setTenancyAlerts(await tenRes.json());
    } catch (e) {
      console.error('Failed to load initial data:', e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handlers
  const handleAddProperty = async (newPropData: Partial<Property>) => {
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPropData)
      });
      if (res.ok) {
        const created = await res.json();
        setProperties([created, ...properties]);
        showToast(`Listing "${created.title}" successfully added to CRM!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyndicateProperties = async (
    propertyIds: string[],
    portals: ('rightmove' | 'zoopla' | 'onthemarket')[]
  ) => {
    try {
      const res = await fetch('/api/syndicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyIds, portals })
      });
      const data = await res.json();
      if (data.success) {
        if (data.properties) setProperties(data.properties);
        if (data.logs) setSyndicationLogs([...data.logs, ...syndicationLogs]);
        showToast(`Successfully syndicated ${propertyIds.length} listing(s) to ${portals.join(', ').toUpperCase()}!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickSyndicate = (propertyId: string) => {
    handleSyndicateProperties([propertyId], ['rightmove', 'zoopla', 'onthemarket']);
  };

  const handleRunAIMatch = (propertyId: string) => {
    setFocusAiPropertyId(propertyId);
    setActiveTab('ai-matcher');
  };

  const handleOpenVirtualTour = (property: Property) => {
    setFocusTourProperty(property);
    setActiveTab('virtual-tours');
  };

  const handleApproveMaintenance = async (ticketId: string) => {
    try {
      const res = await fetch(`/api/maintenance/${ticketId}/approve`, { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        setMaintenanceTickets(maintenanceTickets.map(m => m.id === ticketId ? updated : m));
        showToast('Maintenance repair cost authorized for contractor dispatch!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitNewOffer = async (offerData: any) => {
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData)
      });
      if (res.ok) {
        const created = await res.json();
        setOffers([created, ...offers]);
        showToast(`Offer of £${created.offerAmount.toLocaleString('en-GB')} registered for ${created.buyerName}!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOfferStatus = async (
    offerId: string,
    status: string,
    counterAmount?: number,
    note?: string
  ) => {
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, counterAmount, note })
      });
      if (res.ok) {
        const updated = await res.json();
        setOffers(offers.map(o => o.id === offerId ? updated : o));
        showToast(`Offer status updated to ${status}!`);
        loadInitialData(); // Refresh property status
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter properties by search query if set
  const searchedProperties = properties.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.postcode.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddProperty={() => setIsAddPropertyModalOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        syndicatedCount={properties.filter(p => p.portals.rightmove === 'synced').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'properties' && (
          <PropertyCatalog
            properties={searchedProperties}
            onSelectProperty={(prop, tab) => setSelectedDetailProperty(prop)}
            onQuickSyndicate={handleQuickSyndicate}
            onRunAIMatch={handleRunAIMatch}
            onOpenVirtualTour={handleOpenVirtualTour}
          />
        )}

        {activeTab === 'syndication' && (
          <SyndicationHub
            properties={properties}
            logs={syndicationLogs}
            onTriggerSyndicate={handleSyndicateProperties}
          />
        )}

        {activeTab === 'ai-matcher' && (
          <AIMatcherDashboard
            properties={properties}
            buyers={buyers}
            initialPropertyId={focusAiPropertyId}
          />
        )}

        {activeTab === 'virtual-tours' && (
          <div className="space-y-4">
            <VirtualTourViewer
              property={focusTourProperty || properties[0]}
            />
          </div>
        )}

        {activeTab === 'landlord-portal' && (
          <LandlordPortal
            landlords={landlords}
            statements={statements}
            maintenanceTickets={maintenanceTickets}
            tenancyAlerts={tenancyAlerts}
            onApproveMaintenance={handleApproveMaintenance}
          />
        )}

        {activeTab === 'offer-tracker' && (
          <OfferTracker
            offers={offers}
            properties={properties}
            onSubmitNewOffer={handleSubmitNewOffer}
            onUpdateOfferStatus={handleUpdateOfferStatus}
          />
        )}

        {activeTab === 'gmb-seo' && (
          <GMBSearchPortal
            properties={properties}
            agencyProfile={agencyProfile}
            onOpenVirtualTour={handleOpenVirtualTour}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">PropLens CRM & Property Portal</span>
            <span>• UK Estate & Letting Agency Software</span>
          </div>
          <p className="text-slate-500">
            Powered by Gemini 3.6 Flash • Rightmove RTDF v3 • Zoopla ZPG • OnTheMarket APIs
          </p>
        </div>
      </footer>

      {/* Modals */}
      <PropertyFormModal
        isOpen={isAddPropertyModalOpen}
        onClose={() => setIsAddPropertyModalOpen(false)}
        onAddProperty={handleAddProperty}
      />

      <PropertyDetailModal
        property={selectedDetailProperty}
        isOpen={!!selectedDetailProperty}
        onClose={() => setSelectedDetailProperty(null)}
        onSyndicate={handleQuickSyndicate}
        onRunAIMatch={handleRunAIMatch}
        onSubmitOfferClick={(prop) => {
          setSelectedDetailProperty(null);
          setActiveTab('offer-tracker');
        }}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="h-5 w-5" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
